-- =============================================
-- Supabase SQL Migration: contact_messages
-- Run this in your Supabase SQL Editor
-- =============================================

create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  message     text not null,
  created_at  timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.contact_messages enable row level security;

-- Policy: Only the service role (used by the API) can insert/read.
-- Deny all access from the anon/public role.
create policy "Service role only"
  on public.contact_messages
  for all
  using (false)
  with check (false);
