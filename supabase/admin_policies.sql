-- Run this in Supabase SQL Editor to give admin users full read/write access.
-- After running, set is_admin = true on the relevant row in the profiles table.

-- Admins can view all profiles
create policy "Admins can view all profiles"
  on profiles for select using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true)
  );

-- Admins can update any profile
create policy "Admins can update any profile"
  on profiles for update using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true)
  );

-- Admins can view all drivers
create policy "Admins can view all drivers"
  on drivers for select using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true)
  );

-- Admins can update any driver (approve / reject / suspend)
create policy "Admins can update any driver"
  on drivers for update using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true)
  );

-- Admins can view all bookings
create policy "Admins can view all bookings"
  on bookings for select using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true)
  );

-- Admins can update any booking
create policy "Admins can update any booking"
  on bookings for update using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true)
  );
