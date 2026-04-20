-- Run this in the Supabase SQL Editor to allow unauthenticated document uploads
-- (needed when drivers submit the registration form before signing in)

-- Drop the authenticated-only insert policy
drop policy if exists "Drivers can upload their documents" on storage.objects;

-- Replace with one that allows any user (anon or authenticated) to upload to driver-documents
create policy "Anyone can upload driver documents"
  on storage.objects for insert
  with check (bucket_id = 'driver-documents');

-- Allow unauthenticated users to update/upsert their own uploads too
drop policy if exists "Drivers can update their documents" on storage.objects;

create policy "Anyone can update driver documents"
  on storage.objects for update
  using (bucket_id = 'driver-documents');
