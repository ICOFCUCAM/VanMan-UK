-- Run in Supabase SQL Editor

alter table bookings
  add column if not exists is_recurring boolean not null default false,
  add column if not exists recurring_frequency text
    check (recurring_frequency in ('weekly', 'biweekly', 'monthly'));
