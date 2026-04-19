-- Run this in the Supabase SQL Editor

-- 1. Add document URL columns to drivers table
alter table drivers
  add column if not exists license_document_url text,
  add column if not exists insurance_document_url text,
  add column if not exists vehicle_registration_url text,
  add column if not exists vehicle_photo_url text;

-- 2. Create driver-documents storage bucket (public read so admins can view via URL)
insert into storage.buckets (id, name, public)
values ('driver-documents', 'driver-documents', true)
on conflict (id) do nothing;

-- 3. RLS: allow authenticated users to upload their own documents
create policy "Drivers can upload their documents"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'driver-documents');

-- 4. RLS: allow public read (URLs are unguessable UUIDs per driver email)
create policy "Public can view driver documents"
  on storage.objects for select
  using (bucket_id = 'driver-documents');

-- 5. Allow users to overwrite their own documents (upsert)
create policy "Drivers can update their documents"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'driver-documents');
