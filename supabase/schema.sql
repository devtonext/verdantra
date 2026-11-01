-- ============================================================================
-- VERDANTRA — IDEMPOTENT SUPABASE DATABASE SCHEMA
-- Tables, triggers, security-definer admin functions, RLS policies, & storage
-- Safe to run multiple times in the Supabase SQL Editor.
-- ============================================================================

-- 1. Updated_at helper function
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 2. Admin users table & Security Definer functions
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

create or replace function public.admin_exists()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admin_users
  );
$$;

-- Trigger on auth.users that promotes the FIRST account that signs up to admin
create or replace function public.handle_first_admin_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from public.admin_users) then
    insert into public.admin_users (user_id, email)
    values (new.id, coalesce(new.email, 'admin@local'))
    on conflict (user_id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_first_admin on auth.users;
create trigger on_auth_user_created_first_admin
  after insert on auth.users
  for each row execute function public.handle_first_admin_user();

drop policy if exists "admin_users_admin_all" on public.admin_users;
create policy "admin_users_admin_all"
  on public.admin_users
  for all
  using (public.is_admin())
  with check (public.is_admin());

-- 3. Site Content table (one row per page section)
create table if not exists public.site_content (
  key text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

drop policy if exists "site_content_public_read" on public.site_content;
create policy "site_content_public_read"
  on public.site_content
  for select
  using (true);

drop policy if exists "site_content_admin_all" on public.site_content;
create policy "site_content_admin_all"
  on public.site_content
  for all
  using (public.is_admin())
  with check (public.is_admin());

-- 4. Collection Tables (typed columns, sort_order index, updated_at trigger)

-- 4a. initiatives
create table if not exists public.initiatives (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 1,
  published boolean not null default true,
  title text not null,
  slug text not null,
  tags text[] not null default '{}',
  highlight_tag boolean not null default false,
  event_date text not null default '',
  location text not null default '',
  participants_goal int not null default 100,
  image text not null default '',
  summary text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_initiatives_sort_order on public.initiatives(sort_order);
drop trigger if exists trg_initiatives_updated_at on public.initiatives;
create trigger trg_initiatives_updated_at before update on public.initiatives for each row execute function public.set_updated_at();
alter table public.initiatives enable row level security;
drop policy if exists "initiatives_public_read" on public.initiatives;
create policy "initiatives_public_read" on public.initiatives for select using (published = true or public.is_admin());
drop policy if exists "initiatives_admin_all" on public.initiatives;
create policy "initiatives_admin_all" on public.initiatives for all using (public.is_admin()) with check (public.is_admin());

-- 4b. problems
create table if not exists public.problems (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 1,
  published boolean not null default true,
  featured boolean not null default false,
  title text not null,
  slug text not null,
  badge_1 text not null default '',
  badge_2 text not null default '',
  severity text not null default 'Critical' check (severity in ('Critical', 'High', 'Moderate')),
  metric_value text not null default '',
  metric_label text not null default '',
  image text not null default '',
  summary text not null default '',
  full_analysis text not null default '',
  solution_steps text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_problems_sort_order on public.problems(sort_order);
drop trigger if exists trg_problems_updated_at on public.problems;
create trigger trg_problems_updated_at before update on public.problems for each row execute function public.set_updated_at();
alter table public.problems enable row level security;
drop policy if exists "problems_public_read" on public.problems;
create policy "problems_public_read" on public.problems for select using (published = true or public.is_admin());
drop policy if exists "problems_admin_all" on public.problems;
create policy "problems_admin_all" on public.problems for all using (public.is_admin()) with check (public.is_admin());

-- 4c. projects
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 1,
  published boolean not null default true,
  featured boolean not null default false,
  title text not null,
  slug text not null,
  category text not null default 'Watershed Protection',
  status text not null default 'Active Field Op' check (status in ('Active Field Op', 'Scaling Phase', 'Completed Milestone')),
  location text not null default '',
  completion_pct int not null default 50 check (completion_pct >= 0 and completion_pct <= 100),
  hectares_restored int not null default 0,
  published_date date not null default current_date,
  image text not null default '',
  summary text not null default '',
  body text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_projects_sort_order on public.projects(sort_order);
drop trigger if exists trg_projects_updated_at on public.projects;
create trigger trg_projects_updated_at before update on public.projects for each row execute function public.set_updated_at();
alter table public.projects enable row level security;
drop policy if exists "projects_public_read" on public.projects;
create policy "projects_public_read" on public.projects for select using (published = true or public.is_admin());
drop policy if exists "projects_admin_all" on public.projects;
create policy "projects_admin_all" on public.projects for all using (public.is_admin()) with check (public.is_admin());

-- 4d. stats
create table if not exists public.stats (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 1,
  published boolean not null default true,
  value numeric not null default 0,
  suffix text not null default '',
  label text not null,
  detail text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_stats_sort_order on public.stats(sort_order);
drop trigger if exists trg_stats_updated_at on public.stats;
create trigger trg_stats_updated_at before update on public.stats for each row execute function public.set_updated_at();
alter table public.stats enable row level security;
drop policy if exists "stats_public_read" on public.stats;
create policy "stats_public_read" on public.stats for select using (published = true or public.is_admin());
drop policy if exists "stats_admin_all" on public.stats;
create policy "stats_admin_all" on public.stats for all using (public.is_admin()) with check (public.is_admin());

-- 4e. team
create table if not exists public.team (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 1,
  published boolean not null default true,
  name text not null,
  role text not null,
  location text not null default '',
  image text not null default '',
  bio text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_team_sort_order on public.team(sort_order);
drop trigger if exists trg_team_updated_at on public.team;
create trigger trg_team_updated_at before update on public.team for each row execute function public.set_updated_at();
alter table public.team enable row level security;
drop policy if exists "team_public_read" on public.team;
create policy "team_public_read" on public.team for select using (published = true or public.is_admin());
drop policy if exists "team_admin_all" on public.team;
create policy "team_admin_all" on public.team for all using (public.is_admin()) with check (public.is_admin());

-- 4f. tiers
create table if not exists public.tiers (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 1,
  published boolean not null default true,
  featured boolean not null default false,
  name text not null,
  amount numeric not null default 35,
  frequency text not null default 'monthly' check (frequency in ('monthly', 'one-time', 'annual')),
  impact_metric text not null default '',
  perks text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_tiers_sort_order on public.tiers(sort_order);
drop trigger if exists trg_tiers_updated_at on public.tiers;
create trigger trg_tiers_updated_at before update on public.tiers for each row execute function public.set_updated_at();
alter table public.tiers enable row level security;
drop policy if exists "tiers_public_read" on public.tiers;
create policy "tiers_public_read" on public.tiers for select using (published = true or public.is_admin());
drop policy if exists "tiers_admin_all" on public.tiers;
create policy "tiers_admin_all" on public.tiers for all using (public.is_admin()) with check (public.is_admin());

-- 4g. testimonials
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 1,
  published boolean not null default true,
  quote text not null,
  author text not null,
  role text not null default '',
  avatar text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_testimonials_sort_order on public.testimonials(sort_order);
drop trigger if exists trg_testimonials_updated_at on public.testimonials;
create trigger trg_testimonials_updated_at before update on public.testimonials for each row execute function public.set_updated_at();
alter table public.testimonials enable row level security;
drop policy if exists "testimonials_public_read" on public.testimonials;
create policy "testimonials_public_read" on public.testimonials for select using (published = true or public.is_admin());
drop policy if exists "testimonials_admin_all" on public.testimonials;
create policy "testimonials_admin_all" on public.testimonials for all using (public.is_admin()) with check (public.is_admin());

-- 4h. faqs
create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 1,
  published boolean not null default true,
  category text not null default 'General',
  question text not null,
  answer text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_faqs_sort_order on public.faqs(sort_order);
drop trigger if exists trg_faqs_updated_at on public.faqs;
create trigger trg_faqs_updated_at before update on public.faqs for each row execute function public.set_updated_at();
alter table public.faqs enable row level security;
drop policy if exists "faqs_public_read" on public.faqs;
create policy "faqs_public_read" on public.faqs for select using (published = true or public.is_admin());
drop policy if exists "faqs_admin_all" on public.faqs;
create policy "faqs_admin_all" on public.faqs for all using (public.is_admin()) with check (public.is_admin());

-- 4i. partners
create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 1,
  published boolean not null default true,
  name text not null,
  region text not null default 'Global',
  url text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_partners_sort_order on public.partners(sort_order);
drop trigger if exists trg_partners_updated_at on public.partners;
create trigger trg_partners_updated_at before update on public.partners for each row execute function public.set_updated_at();
alter table public.partners enable row level security;
drop policy if exists "partners_public_read" on public.partners;
create policy "partners_public_read" on public.partners for select using (published = true or public.is_admin());
drop policy if exists "partners_admin_all" on public.partners;
create policy "partners_admin_all" on public.partners for all using (public.is_admin()) with check (public.is_admin());

-- 5. Public Submission Tables (INSERT only for anon/authenticated with default status; full access for admins)

-- 5a. messages (Contact form)
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) <= 160),
  email text not null check (char_length(email) <= 254),
  phone text default '' check (char_length(phone) <= 60),
  subject text not null default 'General Inquiry' check (char_length(subject) <= 240),
  message text not null check (char_length(message) <= 5000),
  status text not null default 'unread' check (status in ('unread', 'read', 'archived')),
  created_at timestamptz not null default now()
);
create index if not exists idx_messages_created_at on public.messages(created_at desc);
alter table public.messages enable row level security;
drop policy if exists "messages_public_insert" on public.messages;
create policy "messages_public_insert" on public.messages for insert with check (status = 'unread');
drop policy if exists "messages_admin_all" on public.messages;
create policy "messages_admin_all" on public.messages for all using (public.is_admin()) with check (public.is_admin());

-- 5b. donations (Contribution pledges)
create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  donor_name text not null check (char_length(donor_name) <= 160),
  email text not null check (char_length(email) <= 254),
  amount numeric not null check (amount > 0),
  frequency text not null default 'monthly' check (frequency in ('monthly', 'one-time', 'annual')),
  tier_name text not null default 'Custom Contribution' check (char_length(tier_name) <= 120),
  focus_area text not null default 'Where Needed Most' check (char_length(focus_area) <= 160),
  notes text default '' check (char_length(notes) <= 2000),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'archived')),
  created_at timestamptz not null default now()
);
create index if not exists idx_donations_created_at on public.donations(created_at desc);
alter table public.donations enable row level security;
drop policy if exists "donations_public_insert" on public.donations;
create policy "donations_public_insert" on public.donations for insert with check (status = 'pending');
drop policy if exists "donations_admin_all" on public.donations;
create policy "donations_admin_all" on public.donations for all using (public.is_admin()) with check (public.is_admin());

-- 5c. volunteers (Field volunteer applications)
create table if not exists public.volunteers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) <= 160),
  email text not null check (char_length(email) <= 254),
  phone text default '' check (char_length(phone) <= 60),
  initiative text not null default 'Beach cleanup' check (char_length(initiative) <= 160),
  availability text not null default 'Flexible' check (char_length(availability) <= 160),
  skills text default '' check (char_length(skills) <= 2500),
  status text not null default 'new' check (status in ('new', 'approved', 'contacted', 'archived')),
  created_at timestamptz not null default now()
);
create index if not exists idx_volunteers_created_at on public.volunteers(created_at desc);
alter table public.volunteers enable row level security;
drop policy if exists "volunteers_public_insert" on public.volunteers;
create policy "volunteers_public_insert" on public.volunteers for insert with check (status = 'new');
drop policy if exists "volunteers_admin_all" on public.volunteers;
create policy "volunteers_admin_all" on public.volunteers for all using (public.is_admin()) with check (public.is_admin());

-- 5d. subscribers (Newsletter signups)
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (char_length(email) <= 254),
  source text not null default 'website_footer' check (char_length(source) <= 120),
  status text not null default 'active' check (status in ('active', 'unsubscribed')),
  created_at timestamptz not null default now()
);
create index if not exists idx_subscribers_created_at on public.subscribers(created_at desc);
alter table public.subscribers enable row level security;
drop policy if exists "subscribers_public_insert" on public.subscribers;
create policy "subscribers_public_insert" on public.subscribers for insert with check (status = 'active');
drop policy if exists "subscribers_admin_all" on public.subscribers;
create policy "subscribers_admin_all" on public.subscribers for all using (public.is_admin()) with check (public.is_admin());

-- 6. Storage: Public `media` bucket
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read"
  on storage.objects for select
  using (bucket_id = 'media');

drop policy if exists "media_admin_insert" on storage.objects;
create policy "media_admin_insert"
  on storage.objects for insert
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media_admin_update" on storage.objects;
create policy "media_admin_update"
  on storage.objects for update
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media_admin_delete" on storage.objects;
create policy "media_admin_delete"
  on storage.objects for delete
  using (bucket_id = 'media' and public.is_admin());
