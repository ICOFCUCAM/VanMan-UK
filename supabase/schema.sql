-- ─── Extensions ──────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── Profiles ────────────────────────────────────────────────────────────────
create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text not null default '',
  phone       text,
  is_student  boolean not null default false,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Users can view their own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, email, full_name, phone, is_student)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.raw_user_meta_data->>'phone',
    coalesce((new.raw_user_meta_data->>'is_student')::boolean, false)
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ─── Drivers ─────────────────────────────────────────────────────────────────
create table if not exists drivers (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid references auth.users(id) on delete set null,
  first_name      text not null,
  last_name       text not null,
  email           text not null unique,
  phone           text not null,
  vehicle_type    text not null,
  vehicle_make    text not null,
  vehicle_model   text not null,
  vehicle_year    text not null,
  vehicle_reg     text not null,
  insurance_type  text not null check (insurance_type in ('comprehensive', 'third-party')),
  tier            text not null default 'silver' check (tier in ('gold', 'silver')),
  status          text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'suspended', 'active')),
  is_online       boolean not null default false,
  rating          numeric(3,2) not null default 5.00,
  total_jobs      integer not null default 0,
  total_earnings  numeric(10,2) not null default 0,
  created_at      timestamptz not null default now()
);

alter table drivers enable row level security;

create policy "Drivers can view their own record"
  on drivers for select using (auth.uid() = user_id);

create policy "Drivers can update their own record"
  on drivers for update using (auth.uid() = user_id);

create policy "Anyone can insert a driver application"
  on drivers for insert with check (true);

-- ─── Bookings ─────────────────────────────────────────────────────────────────
create table if not exists bookings (
  id                  uuid primary key default uuid_generate_v4(),
  booking_ref         text unique default upper(substring(gen_random_uuid()::text, 1, 8)),
  customer_id         uuid references auth.users(id) on delete set null,
  driver_id           uuid references drivers(id) on delete set null,
  collection_address  text not null,
  delivery_address    text not null,
  stop_addresses      text[] not null default '{}',
  has_stairs          boolean not null default false,
  vehicle_type        text not null,
  delivery_type       text not null check (delivery_type in ('dedicated', 'shared')),
  helpers             integer not null default 0,
  distance_miles      numeric(8,2) not null,
  duration            text not null,
  estimated_price     numeric(10,2) not null,
  final_price         numeric(10,2),
  surge_multiplier    numeric(4,2) not null default 1.00,
  status              text not null default 'pending' check (status in ('pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled')),
  payment_method      text not null check (payment_method in ('card', 'cash')),
  payment_status      text not null default 'pending' check (payment_status in ('pending', 'paid', 'refunded')),
  scheduled_at        timestamptz,
  picked_up_at        timestamptz,
  delivered_at        timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

alter table bookings enable row level security;

create policy "Customers can view their own bookings"
  on bookings for select using (auth.uid() = customer_id);

create policy "Customers can create bookings"
  on bookings for insert with check (auth.uid() = customer_id or customer_id is null);

create policy "Drivers can view assigned bookings"
  on bookings for select using (
    exists (select 1 from drivers where drivers.id = bookings.driver_id and drivers.user_id = auth.uid())
  );

create policy "Drivers can update their assigned bookings"
  on bookings for update using (
    exists (select 1 from drivers where drivers.id = bookings.driver_id and drivers.user_id = auth.uid())
  );

-- Auto-update updated_at
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger bookings_updated_at
  before update on bookings
  for each row execute procedure set_updated_at();
