-- Run in Supabase SQL Editor

-- 1. Corporate accounts
create table if not exists corporate_accounts (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  email text not null,
  phone text,
  user_id uuid references auth.users(id) on delete set null,
  discount_pct numeric not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

-- 2. Team members
create table if not exists corporate_team_members (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references corporate_accounts(id) on delete cascade,
  email text not null,
  name text,
  role text not null default 'booker' check (role in ('admin', 'manager', 'booker', 'viewer')),
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (account_id, email)
);

-- 3. Recurring delivery schedules
create table if not exists recurring_schedules (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references corporate_accounts(id) on delete cascade,
  pickup_address text not null,
  delivery_address text not null,
  vehicle_type text not null default 'Medium Van',
  frequency text not null default 'weekly' check (frequency in ('daily', 'weekly', 'biweekly', 'monthly')),
  day_of_week text,
  time_of_day text not null default '09:00',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 4. Link bookings to corporate accounts
alter table bookings
  add column if not exists corporate_account_id uuid references corporate_accounts(id) on delete set null;

-- 5. Enable RLS
alter table corporate_accounts enable row level security;
alter table corporate_team_members enable row level security;
alter table recurring_schedules enable row level security;

-- 6. Corporate accounts policies
create policy "Anyone can create a corporate account"
  on corporate_accounts for insert with check (true);

create policy "Owner or admin can view corporate account"
  on corporate_accounts for select
  using (user_id = auth.uid() or is_admin());

create policy "Owner or admin can update corporate account"
  on corporate_accounts for update
  using (user_id = auth.uid() or is_admin())
  with check (user_id = auth.uid() or is_admin());

-- 7. Team members policies
create policy "Owner or admin can view team"
  on corporate_team_members for select
  using (
    account_id in (select id from corporate_accounts where user_id = auth.uid())
    or is_admin()
  );

create policy "Owner or admin can manage team"
  on corporate_team_members for insert
  with check (
    account_id in (select id from corporate_accounts where user_id = auth.uid())
    or is_admin()
  );

create policy "Owner or admin can delete team members"
  on corporate_team_members for delete
  using (
    account_id in (select id from corporate_accounts where user_id = auth.uid())
    or is_admin()
  );

-- 8. Recurring schedules policies
create policy "Owner or admin can manage schedules"
  on recurring_schedules for all
  using (
    account_id in (select id from corporate_accounts where user_id = auth.uid())
    or is_admin()
  )
  with check (
    account_id in (select id from corporate_accounts where user_id = auth.uid())
    or is_admin()
  );
