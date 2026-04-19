-- ============================================================
-- VanMan-UK Payment Infrastructure Upgrade
-- Run this in the Supabase SQL Editor
-- ============================================================

-- ─── 1. Update payment_status constraint ─────────────────────────────────────
alter table bookings drop constraint if exists bookings_payment_status_check;
alter table bookings
  add constraint bookings_payment_status_check
  check (payment_status in ('pending', 'escrow', 'released', 'refunded', 'invoice_pending'));

-- ─── 2. Add payment + confirmation columns to bookings ────────────────────────
alter table bookings
  add column if not exists original_price        numeric(10,2),
  add column if not exists commission_rate       numeric(5,4) default 0.20,
  add column if not exists commission_amount     numeric(10,2),
  add column if not exists driver_earning        numeric(10,2),
  add column if not exists payment_provider      text,
  add column if not exists payment_intent_id     text,
  add column if not exists stripe_session_id     text,
  add column if not exists escrow_activated      boolean not null default false,
  add column if not exists driver_confirmation   boolean not null default false,
  add column if not exists customer_confirmation boolean not null default false;

-- ─── 3. escrow_payments ──────────────────────────────────────────────────────
create table if not exists escrow_payments (
  id                  uuid primary key default gen_random_uuid(),
  booking_id          uuid references bookings(id) on delete cascade,
  status              text not null default 'held'
    check (status in ('held', 'escrow', 'released', 'refunded')),
  driver_earning      numeric(10,2),
  commission_amount   numeric(10,2),
  refund_amount       numeric(10,2),
  adjustment_required boolean not null default false,
  adjustment_approved boolean not null default false,
  created_at          timestamptz not null default now(),
  released_at         timestamptz
);

alter table escrow_payments enable row level security;

create policy "Admins can manage escrow"
  on escrow_payments for all using (is_admin());

create policy "Customers can view their booking escrow"
  on escrow_payments for select
  using (
    booking_id in (select id from bookings where customer_id = auth.uid())
  );

-- ─── 4. driver_wallets ───────────────────────────────────────────────────────
create table if not exists driver_wallets (
  id              uuid primary key default gen_random_uuid(),
  driver_id       uuid not null unique references drivers(id) on delete cascade,
  balance         numeric(10,2) not null default 0,
  pending         numeric(10,2) not null default 0,
  total_earned    numeric(10,2) not null default 0,
  total_withdrawn numeric(10,2) not null default 0,
  pending_payout  numeric(10,2) not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table driver_wallets enable row level security;

create policy "Driver can view own wallet"
  on driver_wallets for select
  using (
    driver_id in (select id from drivers where user_id = auth.uid())
    or is_admin()
  );

-- ─── 5. driver_wallet_transactions ───────────────────────────────────────────
create table if not exists driver_wallet_transactions (
  id          uuid primary key default gen_random_uuid(),
  driver_id   uuid not null references drivers(id) on delete cascade,
  booking_id  uuid references bookings(id) on delete set null,
  type        text not null
    check (type in ('escrow_hold', 'escrow_release', 'refund_reversal', 'payout', 'bonus')),
  amount      numeric(10,2) not null,
  description text,
  created_at  timestamptz not null default now()
);

alter table driver_wallet_transactions enable row level security;

create policy "Driver can view own transactions"
  on driver_wallet_transactions for select
  using (
    driver_id in (select id from drivers where user_id = auth.uid())
    or is_admin()
  );

-- ─── 6. commission_ledger ────────────────────────────────────────────────────
create table if not exists commission_ledger (
  id                uuid primary key default gen_random_uuid(),
  booking_id        uuid references bookings(id) on delete cascade,
  driver_id         uuid references drivers(id) on delete set null,
  commission_amount numeric(10,2) not null,
  commission_rate   numeric(5,4) not null,
  created_at        timestamptz not null default now()
);

alter table commission_ledger enable row level security;

create policy "Admins can view commission ledger"
  on commission_ledger for all using (is_admin());

-- ─── 7. Auto-create wallet when a driver is approved/inserted ─────────────────
create or replace function create_driver_wallet()
returns trigger language plpgsql security definer as $$
begin
  insert into driver_wallets (driver_id)
  values (new.id)
  on conflict (driver_id) do nothing;
  return new;
end;
$$;

drop trigger if exists trg_create_driver_wallet on drivers;
create trigger trg_create_driver_wallet
  after insert on drivers
  for each row execute procedure create_driver_wallet();

-- Create wallets for existing drivers
insert into driver_wallets (driver_id)
select id from drivers
where id not in (select driver_id from driver_wallets)
on conflict (driver_id) do nothing;

-- ─── 8. Dispatch function: assign best available driver ───────────────────────
create or replace function dispatch_assign_best_driver(p_booking_id uuid)
returns void language plpgsql security definer as $$
declare
  v_driver_id   uuid;
  v_vehicle_type text;
begin
  select vehicle_type into v_vehicle_type
  from bookings where id = p_booking_id;

  -- Highest-rated online driver with matching vehicle, not already on a job
  select d.id into v_driver_id
  from drivers d
  where d.status in ('active', 'approved')
    and d.is_online = true
    and d.vehicle_type = v_vehicle_type
    and d.id not in (
      select driver_id from bookings
      where status in ('assigned', 'in_progress')
        and driver_id is not null
    )
  order by d.rating desc, d.total_jobs desc
  limit 1;

  if v_driver_id is not null then
    update bookings
    set driver_id = v_driver_id,
        status = 'assigned'
    where id = p_booking_id and driver_id is null;
  else
    -- No driver available — admin assigns manually
    update bookings
    set status = 'confirmed'
    where id = p_booking_id;
  end if;
end;
$$;

-- ─── 9. Trigger: dispatch when payment captured ───────────────────────────────
create or replace function trg_dispatch_on_payment_fn()
returns trigger language plpgsql security definer as $$
begin
  if new.payment_status in ('escrow', 'paid')
    and old.payment_status = 'pending'
    and new.driver_id is null then
    perform dispatch_assign_best_driver(new.id);
  end if;
  return new;
end;
$$;

drop trigger if exists trg_dispatch_on_payment_captured on bookings;
create trigger trg_dispatch_on_payment_captured
  after update of payment_status on bookings
  for each row execute procedure trg_dispatch_on_payment_fn();

-- ─── 10. Trigger: release escrow when both parties confirm ────────────────────
create or replace function release_escrow_fn()
returns trigger language plpgsql security definer as $$
declare
  v_escrow    escrow_payments%rowtype;
  v_driver_id uuid;
  v_commission_rate numeric;
  v_driver_earning  numeric;
  v_commission      numeric;
begin
  -- Only fire on the transition to both-confirmed
  if not (new.driver_confirmation = true and new.customer_confirmation = true
    and (old.driver_confirmation = false or old.customer_confirmation = false)) then
    return new;
  end if;

  select * into v_escrow
  from escrow_payments
  where booking_id = new.id and status = 'escrow'
  limit 1;

  -- Calculate commission based on driver tier (gold=15%, silver=20%)
  select
    case when d.tier = 'gold' then 0.15 else 0.20 end,
    d.id
  into v_commission_rate, v_driver_id
  from drivers d
  where d.id = new.driver_id;

  v_commission    := coalesce(new.estimated_price, 0) * v_commission_rate;
  v_driver_earning := coalesce(new.estimated_price, 0) - v_commission;

  if v_escrow.id is not null then
    -- Credit driver wallet
    if v_driver_id is not null then
      update driver_wallets
      set balance      = balance + coalesce(v_escrow.driver_earning, v_driver_earning),
          pending      = greatest(0, pending - coalesce(v_escrow.driver_earning, v_driver_earning)),
          total_earned = total_earned + coalesce(v_escrow.driver_earning, v_driver_earning),
          updated_at   = now()
      where driver_id = v_driver_id;

      insert into driver_wallet_transactions (driver_id, booking_id, type, amount, description)
      values (
        v_driver_id, new.id, 'escrow_release',
        coalesce(v_escrow.driver_earning, v_driver_earning),
        'Payment released for booking ' || coalesce(new.booking_ref, new.id::text)
      );

      -- Record commission
      insert into commission_ledger (booking_id, driver_id, commission_amount, commission_rate)
      values (new.id, v_driver_id, v_commission, v_commission_rate)
      on conflict do nothing;
    end if;

    -- Release escrow record
    update escrow_payments
    set status = 'released', released_at = now()
    where id = v_escrow.id;
  end if;

  -- Update booking
  update bookings
  set payment_status = 'released',
      status         = 'completed',
      delivered_at   = now(),
      final_price    = coalesce(final_price, estimated_price)
  where id = new.id;

  return new;
end;
$$;

drop trigger if exists trg_release_escrow on bookings;
create trigger trg_release_escrow
  after update of driver_confirmation, customer_confirmation on bookings
  for each row execute procedure release_escrow_fn();
