-- Run this in Supabase SQL Editor.
-- Uses a SECURITY DEFINER function to avoid infinite recursion in RLS policies.

-- Step 1: Helper function that checks is_admin without triggering RLS
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce(
    (select is_admin from profiles where id = auth.uid() limit 1),
    false
  )
$$;

-- Step 2: Drop any existing admin policies (safe to re-run)
drop policy if exists "Admins can view all profiles" on profiles;
drop policy if exists "Admins can update any profile" on profiles;
drop policy if exists "Admins can view all drivers" on drivers;
drop policy if exists "Admins can update any driver" on drivers;
drop policy if exists "Admins can view all bookings" on bookings;
drop policy if exists "Admins can update any booking" on bookings;

-- Step 3: Recreate policies using is_admin() — no recursive subquery

create policy "Admins can view all profiles"
  on profiles for select using (auth.uid() = id or is_admin());

create policy "Admins can update any profile"
  on profiles for update using (auth.uid() = id or is_admin());

create policy "Admins can view all drivers"
  on drivers for select using (user_id = auth.uid() or is_admin());

create policy "Admins can update any driver"
  on drivers for update using (user_id = auth.uid() or is_admin());

create policy "Admins can view all bookings"
  on bookings for select using (customer_id = auth.uid() or is_admin());

create policy "Admins can update any booking"
  on bookings for update using (customer_id = auth.uid() or is_admin());
