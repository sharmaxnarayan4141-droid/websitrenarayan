-- =============================================
-- Supabase SQL Migration: Admin Panel Tables
-- Run this in your Supabase SQL Editor AFTER
-- the initial contact_messages migration
-- =============================================

-- 1. Add a "read" column to contact_messages
alter table public.contact_messages
  add column if not exists read boolean not null default false;

-- 2. Skills table
create table if not exists public.skills (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

-- 3. Projects / Work table
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text not null default '',
  stack       text[] not null default '{}',
  sort_order  int not null default 0,
  url         text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 4. Site sections (editable content blocks)
create table if not exists public.site_sections (
  id            uuid primary key default gen_random_uuid(),
  section_key   text not null unique,
  content       jsonb not null default '{}',
  updated_at    timestamptz not null default now()
);

-- Enable Row Level Security on new tables
alter table public.skills enable row level security;
alter table public.projects enable row level security;
alter table public.site_sections enable row level security;

-- Service role bypasses RLS, so these policies only affect anonymous/authenticated roles.
-- Deny all mutations for non-service-role users; the public anon key only needs SELECT.
create policy "Service role only"
  on public.skills
  for all
  using (false)
  with check (false);

create policy "Service role only"
  on public.projects
  for all
  using (false)
  with check (false);

create policy "Service role only"
  on public.site_sections
  for all
  using (false)
  with check (false);

-- Public read-only access (for the public site to fetch skills, projects, sections)
create policy "Public read access"
  on public.skills
  for select
  using (true);

create policy "Public read access"
  on public.projects
  for select
  using (true);

create policy "Public read access"
  on public.site_sections
  for select
  using (true);

-- =============================================
-- Seed initial site_sections with default content
-- =============================================
insert into public.site_sections (section_key, content) values
  ('hero', '{
    "name": "Narayan Sharma",
    "subtitle": "AI & Prompt Engineering Enthusiast · Commerce + CS Student · Jodhpur, Rajasthan"
  }'::jsonb),
  ('about', '{
    "intro": "I''m Narayan Sharma — a Class 12 student studying Commerce with Computer Science at St. Austin Sr. Sec. School, Jodhpur, Rajasthan.",
    "bio": "I am passionate about Artificial Intelligence and Prompt Engineering. I believe in the intersection of discipline and creativity — whether it is crafting precise prompts, building digital experiences, or solving real-world problems through technology.",
    "facts": [
      {"label": "Location", "value": "Jodhpur, Rajasthan, India"},
      {"label": "School", "value": "St. Austin Sr. Sec. School"},
      {"label": "Stream", "value": "Commerce + Computer Science"},
      {"label": "Focus", "value": "AI & Prompt Engineering"}
    ]
  }'::jsonb),
  ('skills', '{
    "title": "Skills"
  }'::jsonb),
  ('work_credentials', '{
    "title": "Credentials",
    "items": [
      {
        "label": "Course",
        "value": "AI Essentials and Prompt Mastery"
      },
      {
        "label": "Issued By",
        "value": "SIN School of AI — Dept. of AI & ML"
      },
      {
        "label": "Accreditations",
        "value": "EGAC (CAB 12203) · ISO 9001:2015 · IAF"
      },
      {
        "label": "Signed By",
        "value": "Er. Harshvardhan Purohit · Shiv Prakash Bohra"
      },
      {
        "label": "Certificate ID",
        "value": "48dca1eb-7d5a-4ea1-b498-043b5983b748"
      }
    ]
  }'::jsonb),
  ('work_education', '{
    "title": "Education",
    "items": [
      {
        "name": "St. Austin Sr. Sec. School",
        "sub": "Commerce + Computer Science · Class 12 (Current)",
        "location": "Jodhpur, Rajasthan, India"
      }
    ]
  }'::jsonb)
on conflict (section_key) do nothing;

-- Seed default skills
insert into public.skills (name, sort_order) values
  ('Prompt Engineering', 1),
  ('AI Essentials', 2),
  ('Generative AI', 3),
  ('ChatGPT', 4),
  ('Computer Science', 5),
  ('Commerce', 6),
  ('Accounting', 7),
  ('Microsoft Office', 8),
  ('Canva', 9),
  ('Communication', 10),
  ('Problem Solving', 11),
  ('Research', 12)
on conflict do nothing;

-- Seed default projects
insert into public.projects (name, description, stack, sort_order) values
  (
    'Portfolio Website',
    'This personal portfolio — built with Next.js 14, Framer Motion, and GSAP — showcasing my background, AI certification, and skills in a premium dark aesthetic.',
    ARRAY['Next.js', 'Tailwind CSS', 'Framer Motion', 'Supabase'],
    1
  ),
  (
    'AI Prompt Engineering Practice',
    'Applied prompt crafting workflows for research, content generation, and productivity automation. Completed as part of the SIN School of AI certification curriculum.',
    ARRAY['ChatGPT', 'Prompt Engineering', 'Generative AI'],
    2
  ),
  (
    'Commerce + CS Academic Projects',
    'Academic projects combining Commerce fundamentals with Computer Science applications, covering financial modeling, data handling, and presentation design.',
    ARRAY['MS Office', 'Computer Science', 'Accounting'],
    3
  )
on conflict do nothing;
