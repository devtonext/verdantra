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


-- ============================================================================
-- VERDANTRA — GENERATED DEMO SEED SQL (DO NOT EDIT MANUALLY)
-- Generated by scripts/build-sql.mjs from src/lib/defaults.js
-- Safe to re-run: only populates empty tables and missing content keys.
-- ============================================================================

-- 1. Page Sections (site_content)
insert into public.site_content (key, data) values ('general', '{"brand_name":"Verdantra","brand_group":"Verdantra Group","tagline":"Saving Nature & Fighting Climate Change Together.","primary_color":"#E2F652","accent_color":"#121412","announcement_enabled":true,"announcement_text":"2026 Altiplano & Coastal Basin Field Expeditions are now open for volunteer registration","announcement_link":"/contribution?tab=volunteer","nav_home_label":"Home","nav_contribution_label":"Contribution","nav_mission_label":"Our Mission","nav_problems_label":"Problems","nav_projects_label":"Projects","nav_cta_label":"Contact Us","nav_cta_link":"/contact","footer_copyright":"©2026, All Right Reserved","footer_tagline":"We are an organization dedicated to protecting the environment & nature."}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, data) values ('seo', '{"meta_title":"Verdantra — Saving Nature & Fighting Climate Change Together","meta_description":"Verdantra partners with frontline communities and ecological scientists to restore fragile salt-flat basins, protect mountain glaciers, and reverse climate disruption.","og_image":"/images/hero-basin.jpg"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, data) values ('contact', '{"phone":"+1 (415) 890-4320","email":"field-ops@verdantra.org","address":"740 Biosphere Way, Suite 300, San Francisco, CA 94107","hours":"Mon – Fri: 08:30 – 18:00 PST · Field Dispatch 24/7","map_embed_url":"https://www.openstreetmap.org/export/embed.html?bbox=-68.35%2C-23.05%2C-67.95%2C-22.75&layer=mapnik","instagram_url":"https://instagram.com/verdantra","facebook_url":"https://facebook.com/verdantra","twitter_url":"https://twitter.com/verdantra"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, data) values ('home_hero', '{"eyebrow":"Verdantra Group","headline_line_1_left":"Saving","headline_line_1_right":"Nature &","headline_line_2_left":"Fighting","headline_line_2_underline":"Climate","headline_line_3":"Change Together.","input_placeholder":"Enter your e-mail","subscribe_button_text":"Subscribe","members_count_label":"1.7M+ members of our\ncharity organization","hero_image":"/images/hero-basin.jpg","volunteer_card_title":"We & Our\nVolunteers","volunteer_card_image":"/images/volunteer-portrait.jpg","volunteer_card_link":"/mission","pin_1_label":"Ocean Pollution","pin_1_slug":"ocean-pollution","pin_1_x":"24%","pin_1_y":"46%","pin_2_label":"GHG Emissions","pin_2_slug":"ghg-emissions","pin_2_x":"76%","pin_2_y":"39%","pin_3_label":"Glacier Melting","pin_3_slug":"glacier-melting","pin_3_x":"64%","pin_3_y":"58%","bottom_badge_text":"Join us in fighting\nenvironmental problems","bottom_badge_avatar":"/images/volunteer-portrait.jpg","social_prompt_text":"Find us on social networks","right_corner_summary":"We are an organization dedicated to\nprotecting the environment & nature."}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, data) values ('home_mission', '{"heading":"Let''s Make Our World\nCleaner & Greener!","subtitle":"We work with partners & communities to ensure\nnature thrives and climate change is reversed","primary_cta_label":"View Projects","primary_cta_link":"/projects","secondary_cta_label":"Learn More","secondary_cta_link":"/mission","vignette_1_image":"/images/lagoon-mirror.jpg","vignette_2_image":"/images/mountain-mist.jpg","vignette_3_image":"/images/glacier-ice.jpg","vignette_4_image":"/images/canyon-ridge.jpg"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, data) values ('home_pillars', '{"pill_1_text":"We","pill_2_text":"Protect","pill_2_image":"/images/glacier-ice.jpg","pill_3_link":"/mission","pill_4_text":"Nature","pill_4_image":"/images/canyon-ridge.jpg"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, data) values ('home_initiatives', '{"heading":"Our initiatives for 2026","subtitle":"Find out what projects we are\nimplementing to protect nature","col_title_label":"Title","col_tags_label":"Tags","col_date_label":"Date"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, data) values ('home_problems', '{"section_eyebrow":"Critical Frontlines","section_heading":"Ecological Crises We Actively Confront","explore_button_label":"EXPLORE PROBLEM"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, data) values ('home_impact', '{"eyebrow":"Verified Telemetry & Field Results","heading":"Measurable Restoration Across\nThreatened Watersheds","subtitle":"Every hectare we protect is monitored via satellite radar, solar piezometers, and community water councils.","projects_heading":"Active Field Expeditions & Dispatches","projects_cta_label":"View All Field Projects"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, data) values ('home_voices', '{"eyebrow":"Frontline Coalition","heading":"Voices From Indigenous Guardians\n& Field Hydrologists","partners_label":"Audited & Supported By Global Research Institutions"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, data) values ('home_faq', '{"eyebrow":"Transparency & Operations","heading":"Common Questions About Our\nField Expeditions & Funding","callout_title":"Ready to Join a 2026 Conservation Expedition?","callout_body":"Whether you fund a solar telemetry node or join our May coastal lagoon cleanup in person, 94% of every contribution goes directly to frontline restoration.","callout_primary_label":"Pledge Monthly Support","callout_secondary_label":"Apply as Field Volunteer"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, data) values ('home_newsletter', '{"badge_label":"newsletter","heading":"Subscribe to our newsletter to get the latest\nupdates on missions projects & initiatives.","input_placeholder":"Email address","button_label":"Subscribe"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, data) values ('contribution_page', '{"eyebrow":"Direct Ecological Action","heading":"Fuel Frontline Restoration &\nCommunity Stewardship","subtitle":"Every contribution directly funds satellite telemetry, native seedling nurseries, coastal cleanup vessels, and indigenous watershed guardians.","calculator_heading":"Interactive Impact Estimator","calculator_note":"100% of public contributions go directly to field equipment and biosphere restoration grants.","donation_form_heading":"Pledge a Direct Contribution","volunteer_form_heading":"Apply for Field Volunteering"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, data) values ('mission_page', '{"eyebrow":"Our Scientific Mandate","heading":"Restoring Earth’s Fragile\nBiomes Through Field Science","subtitle":"Founded by hydrologists, glaciologists, and indigenous land defenders, Verdantra bridges high-resolution climate telemetry with hands-on habitat recovery.","manifesto_title":"Why We Operate at the Frontlines","manifesto_body":"Climate disruption is felt first in high-altitude basins, glacial headwaters, and coastal salt marshes. Rather than funding distant overhead, we deploy rapid-response conservation teams directly into threatened watersheds—measuring biodiversity recovery down to every hectare.","banner_image":"/images/hero-basin.jpg"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, data) values ('problems_page', '{"eyebrow":"Planetary Diagnostics","heading":"Four Interlocking Crises\nThreatening Global Biospheres","subtitle":"Explore our open-access ecological dossiers detailing root causes, satellite metrics, and active remediation protocols."}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, data) values ('projects_page', '{"eyebrow":"Field Operations & Reports","heading":"Active Conservation Projects\n& Expedition Dispatches","subtitle":"Track live restoration milestones, habitat recovery metrics, and field dispatches across our global biomes."}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, data) values ('contact_page', '{"eyebrow":"Direct Dispatch","heading":"Connect With Our Field\nCoordinators & Science Desk","subtitle":"Reach out to partner on watershed restoration, sponsor a regional cleanup, request telemetry data, or coordinate press inquiries."}'::jsonb) on conflict (key) do nothing;

-- 2. Collections
insert into public.initiatives (sort_order, published, title, slug, tags, highlight_tag, event_date, location, participants_goal, image, summary)
select sort_order, published, title, slug, tags, highlight_tag, event_date, location, participants_goal, image, summary
from jsonb_populate_recordset(null::public.initiatives, '[{"sort_order":1,"published":true,"title":"Tree planting","slug":"andean-polylepis-tree-planting","tags":["green and cleaner"],"highlight_tag":false,"event_date":"12/03/26","location":"Atacama & High Andean Foothills","participants_goal":1400,"image":"/images/canyon-ridge.jpg","summary":"Re-establishing high-altitude native Polylepis and tamarugo woodland corridors to anchor arid soils and capture mountain fog moisture."},{"sort_order":2,"published":true,"title":"Beach cleanup","slug":"coastal-salt-marsh-beach-cleanup","tags":["future generations"],"highlight_tag":true,"event_date":"29/05/26","location":"Pacific Humboldt Lagoon & Coastline","participants_goal":2800,"image":"/images/lagoon-mirror.jpg","summary":"Coordinated marine debris extraction and microplastic filtration across 180 kilometers of critical shorebird and flamingo nesting lagoons."},{"sort_order":3,"published":true,"title":"Educational events","slug":"climate-literacy-educational-events","tags":["courses","green initiatives"],"highlight_tag":false,"event_date":"06/06/26","location":"14 Regional Field Stations & Online","participants_goal":5200,"image":"/images/glacier-ice.jpg","summary":"Open-enrollment field hydrology workshops, youth climate fellowships, and citizen-science water quality monitoring bootcamps."},{"sort_order":4,"published":true,"title":"Park cleaning","slug":"biosphere-reserve-park-cleaning","tags":["day off cleaning"],"highlight_tag":false,"event_date":"18/08/26","location":"Salar Basin & Alpine National Reserves","participants_goal":1950,"image":"/images/hero-basin.jpg","summary":"Volunteer trail remediation, invasive species removal, and solar waste-station installation across protected highland parks."}]'::jsonb)
where not exists (select 1 from public.initiatives);

insert into public.problems (sort_order, published, featured, title, slug, badge_1, badge_2, severity, metric_value, metric_label, image, summary, full_analysis, solution_steps)
select sort_order, published, featured, title, slug, badge_1, badge_2, severity, metric_value, metric_label, image, summary, full_analysis, solution_steps
from jsonb_populate_recordset(null::public.problems, '[{"sort_order":1,"published":true,"featured":true,"title":"Ocean\nPollution","slug":"ocean-pollution","badge_1":"Ecological Catastrophe","badge_2":"Pollution Issues","severity":"Critical","metric_value":"14.2M Tons","metric_label":"Annual synthetic polymers & industrial brine entering coastal basins","image":"/images/lagoon-mirror.jpg","summary":"Millions of tons of plastic threaten the lives of aquatic animals and ecosystems.","full_analysis":"Coastal estuaries and high-altitude endorheic lagoons face unprecedented chemical and microplastic accumulation. Synthetic polymers fracture into bio-persistent particles that disrupt plankton photosynthesis, poison filter-feeding flamingos and marine life, and deoxygenate breeding waters.","solution_steps":["Deploy autonomous solar-powered riverine debris interceptors at 28 tributary mouths","Partner with artisanal fishing cooperatives to recover ghost nets and industrial lines","Enforce real-time salinity and heavy-metal telemetry across fragile wetland basins"]},{"sort_order":2,"published":true,"featured":false,"title":"Glacier\nMelting","slug":"glacier-melting","badge_1":"Cryosphere Alert","badge_2":"Freshwater Loss","severity":"Critical","metric_value":"-38% Mass","metric_label":"Tropical & southern mountain glacier volume lost since 1985","image":"/images/glacier-ice.jpg","summary":"Due to melting glaciers and icebergs, the habitats of animals and insects are changing.","full_analysis":"Mountain glaciers serve as natural water towers for over two billion people and countless alpine ecosystems. Rising freezing levels and black-carbon soot deposition accelerate summer ablation, destabilizing glacial lakes and starving downstream wetlands during dry seasons.","solution_steps":["Install high-altitude ultrasonic ablation stakes and satellite radar reflectors","Restore downstream bofedales (peatland sponges) to retain seasonal glacial meltwater","Eliminate regional black-carbon diesel soot corridors near cryosphere reserves"]},{"sort_order":3,"published":true,"featured":false,"title":"Forest\nClearance","slug":"forest-clearance","badge_1":"Habitat Fragmentation","badge_2":"Biodiversity Loss","severity":"High","metric_value":"4.1M Hectares","metric_label":"Primary dryland & montane forest canopy lost annually","image":"/images/canyon-ridge.jpg","summary":"Forest clearance is destroying the homes of rare species of plants and animals.","full_analysis":"When ancient woodland corridors and arid-adapted dry forests are cleared for extractive industry or overgrazing, topsoil erodes rapidly into river valleys. Native pollinators vanish, local rainfall recycling collapses, and stored soil carbon oxidizes back into the atmosphere.","solution_steps":["Propagate 1.2 million drought-resilient native saplings in community-run nurseries","Establish legally protected indigenous conservation easements linking fragmented habitats","Deploy acoustic bio-monitors to detect illegal logging and track avian recovery"]},{"sort_order":4,"published":true,"featured":false,"title":"GHG\nEmissions","slug":"ghg-emissions","badge_1":"Atmospheric Forcing","badge_2":"Thermal Spike","severity":"Critical","metric_value":"426 ppm","metric_label":"Atmospheric CO2 concentration driving radiative heat trapping","image":"/images/mountain-mist.jpg","summary":"Excessive greenhouse gas emissions lead to climate disasters. Greenhouse gas emissions heat the planet.","full_analysis":"Unabated combustion of fossil fuels and degradation of natural peat and coastal carbon sinks have pushed atmospheric greenhouse gas concentrations to levels unseen in three million years—intensifying megadroughts, thermal anomalies, and extreme precipitation events.","solution_steps":["Lock carbon permanently in restored coastal blue-carbon mangroves and highland peat bogs","Transition remote field villages and ranger stations to 100% micro-grid solar power","Publish open-ledger carbon sequestration audits verified by independent soil scientists"]}]'::jsonb)
where not exists (select 1 from public.problems);

insert into public.projects (sort_order, published, featured, title, slug, category, status, location, completion_pct, hectares_restored, published_date, image, summary, body)
select sort_order, published, featured, title, slug, category, status, location, completion_pct, hectares_restored, published_date, image, summary, body
from jsonb_populate_recordset(null::public.projects, '[{"sort_order":1,"published":true,"featured":true,"title":"Salar Basin Hydrological Shield & Lagoon Recovery","slug":"salar-basin-hydrological-shield","category":"Watershed Protection","status":"Active Field Op","location":"Atacama Altiplano Basin","completion_pct":84,"hectares_restored":18400,"published_date":"2026-03-15","image":"/images/hero-basin.jpg","summary":"Protecting high-altitude hypersaline lagoons and Andean flamingo breeding grounds with real-time aquifer telemetry and community buffer zones.","body":"High-altitude salt flats and endorheic lagoons are among the most fragile ecosystems on Earth. Over the past 36 months, Verdantra field hydrologists have installed 64 solar-powered piezometers across the basin, empowering indigenous water councils with live groundwater data.\n\nAlongside telemetry, our volunteers have restored 18,400 hectares of surrounding shoreline vegetation, preventing windborne dust contamination and stabilizing nesting islands for three threatened flamingo species."},{"sort_order":2,"published":true,"featured":true,"title":"Pacific Humboldt Microplastic Interceptor Array","slug":"humboldt-microplastic-interceptor-array","category":"Ocean & Estuaries","status":"Active Field Op","location":"Coastal Estuaries & Fjords","completion_pct":72,"hectares_restored":11200,"published_date":"2026-04-22","image":"/images/lagoon-mirror.jpg","summary":"Intercepting river-borne plastics before they reach marine upwelling zones using passive kinetic barriers and local recycling micro-plants.","body":"Over 80% of coastal plastic pollution enters the ocean through a handful of seasonal river mouths. Verdantra engineered non-invasive floating booms that guide surface plastics into solar-driven conveyor skimmers without obstructing fish migration.\n\nCollected polymers are sorted by coastal cooperatives and upcycled into durable construction lumber for local marine sanctuaries."},{"sort_order":3,"published":true,"featured":true,"title":"Southern Cryosphere & Bofedales Sponge Network","slug":"cryosphere-bofedales-sponge-network","category":"Glacier Preservation","status":"Active Field Op","location":"Highland Cordilleras","completion_pct":68,"hectares_restored":9600,"published_date":"2026-05-10","image":"/images/glacier-ice.jpg","summary":"Rehydrating high-mountain cushion peatlands below retreating glaciers to buffer dry-season river flow and lock deep soil carbon.","body":"As mountain glaciers retreat, downstream valleys face flash flooding in summer followed by severe water scarcity in autumn. By constructing ancestral stone infiltration dykes (qochas) and re-seeding native cushion plants, our teams turn degraded valleys back into living water sponges."},{"sort_order":4,"published":true,"featured":false,"title":"Arid Canyon Polylepis Cloud-Forest Corridor","slug":"arid-canyon-cloud-forest-corridor","category":"Reforestation","status":"Scaling Phase","location":"Red Canyon Watersheds","completion_pct":91,"hectares_restored":24500,"published_date":"2026-06-02","image":"/images/canyon-ridge.jpg","summary":"Connecting fragmented canyon habitats with 850,000 native drought-hardy trees grown in women-led community nurseries.","body":"Even in hyper-arid canyons, native tree canopies comb moisture directly from coastal fog banks. Our community nurseries germinate local ecotype seeds with a 92% survival rate, restoring springs that had run dry for four decades."},{"sort_order":5,"published":true,"featured":false,"title":"Alpine Carbon Flux Tower & Clean Micro-Grid","slug":"alpine-carbon-flux-clean-microgrid","category":"GHG Mitigation","status":"Completed Milestone","location":"Cloud Peak Biosphere","completion_pct":100,"hectares_restored":15800,"published_date":"2026-07-19","image":"/images/mountain-mist.jpg","summary":"Replacing diesel generators across 22 mountain villages with clean solar-storage microgrids while monitoring regional carbon uptake.","body":"Black carbon soot from off-grid diesel generators settles on nearby snowpacks, darkening their surface and speeding up thaw. Replacing these generators with community-owned solar microgrids cuts 19,000 tons of CO2-equivalent emissions annually."}]'::jsonb)
where not exists (select 1 from public.projects);

insert into public.stats (sort_order, published, value, suffix, label, detail)
select sort_order, published, value, suffix, label, detail
from jsonb_populate_recordset(null::public.stats, '[{"sort_order":1,"published":true,"value":1700000,"suffix":"+","label":"Active Global Members","detail":"Donors, citizen scientists & field volunteers across 42 countries"},{"sort_order":2,"published":true,"value":79500,"suffix":" ha","label":"Hectares Restored","detail":"Protected watersheds, salt-flat buffers & reforested canyons"},{"sort_order":3,"published":true,"value":3400,"suffix":" tons","label":"Marine Debris Removed","detail":"Extracted from coastal lagoons, estuaries & shoreline reserves"},{"sort_order":4,"published":true,"value":94,"suffix":"%","label":"Direct Field Allocation","detail":"Every dollar audited and deployed directly to conservation ops"}]'::jsonb)
where not exists (select 1 from public.stats);

insert into public.team (sort_order, published, name, role, location, image, bio)
select sort_order, published, name, role, location, image, bio
from jsonb_populate_recordset(null::public.team, '[{"sort_order":1,"published":true,"name":"Dr. Elena Rostova","role":"Chief Glaciologist & Executive Director","location":"San Francisco & Santiago","image":"/images/volunteer-portrait.jpg","bio":"18 years leading high-altitude cryosphere telemetry and watershed resilience across the Andes and Pacific Rim."},{"sort_order":2,"published":true,"name":"Mateo Valdivia","role":"Director of Basin & Lagoon Operations","location":"San Pedro Field Station","image":"/images/hero-basin.jpg","bio":"Hydrologist specializing in hypersaline wetland conservation, indigenous water governance, and piezometer networks."},{"sort_order":3,"published":true,"name":"Amara Okafor","role":"Head of Marine & Estuary Cleanups","location":"Coastal Humboldt Hub","image":"/images/lagoon-mirror.jpg","bio":"Environmental engineer designing solar riverine plastic interceptors and zero-waste coastal recovery hubs."},{"sort_order":4,"published":true,"name":"Dr. Henrik Lindqvist","role":"Lead Atmospheric & Carbon Scientist","location":"Alpine Biosphere Desk","image":"/images/mountain-mist.jpg","bio":"Biogeochemist overseeing eddy-covariance carbon flux towers and blue-carbon soil sequestration audits."}]'::jsonb)
where not exists (select 1 from public.team);

insert into public.tiers (sort_order, published, featured, name, amount, frequency, impact_metric, perks)
select sort_order, published, featured, name, amount, frequency, impact_metric, perks
from jsonb_populate_recordset(null::public.tiers, '[{"sort_order":1,"published":true,"featured":false,"name":"Seedling Steward","amount":35,"frequency":"monthly","impact_metric":"Plants 15 native drought-hardy trees & funds 10m² of lagoon cleanup every month","perks":["Monthly satellite restoration dispatch & coordinates","Verified carbon & biodiversity ledger certificate","Access to quarterly live scientist Q&A briefings"]},{"sort_order":2,"published":true,"featured":true,"name":"Watershed Guardian","amount":95,"frequency":"monthly","impact_metric":"Sponsors 1 full telemetry sensor node & 45 native canopy saplings monthly","perks":["All Seedling Steward benefits included","Live dashboard access to your sponsored basin sensor","Priority invitation to annual regional field expeditions","Annual printed Ecological Atlas & field report"]},{"sort_order":3,"published":true,"featured":false,"name":"Biosphere Patron","amount":250,"frequency":"monthly","impact_metric":"Underwrites 2 hectares of permanent wetland easement & marine interceptor ops","perks":["All Watershed Guardian benefits included","Dedicated conservation impact briefing with field leads","Named recognition on field station solar telemetry plaques"]}]'::jsonb)
where not exists (select 1 from public.tiers);

insert into public.testimonials (sort_order, published, quote, author, role, avatar)
select sort_order, published, quote, author, role, avatar
from jsonb_populate_recordset(null::public.testimonials, '[{"sort_order":1,"published":true,"quote":"Working alongside Verdantra’s hydrologists transformed how our community monitors lagoon water levels. Within two seasons, nesting flamingos returned to our eastern salt marsh.","author":"Lucía Quispe","role":"Indigenous Water Council Coordinator, Altiplano Basin","avatar":"/images/volunteer-portrait.jpg"},{"sort_order":2,"published":true,"quote":"Unlike traditional charities where funds disappear into bureaucracy, Verdantra publishes exact GPS polygons and sensor telemetry for every single hectare restored.","author":"Marcus Vance","role":"Climate Philanthropy Lead, Pacific Horizon Fund","avatar":"/images/glacier-ice.jpg"},{"sort_order":3,"published":true,"quote":"Joining the May coastal lagoon cleanup was unforgettable. Over 400 volunteers worked in tandem with solar skimmers to clear 18 tons of ghost nets in a single weekend.","author":"Sofia Lindholm","role":"Field Volunteer & Marine Biologist","avatar":"/images/lagoon-mirror.jpg"}]'::jsonb)
where not exists (select 1 from public.testimonials);

insert into public.faqs (sort_order, published, category, question, answer)
select sort_order, published, category, question, answer
from jsonb_populate_recordset(null::public.faqs, '[{"sort_order":1,"published":true,"category":"Contributions","question":"How much of my contribution goes directly to field conservation?","answer":"94% of every contribution goes directly to frontline field operations, native nurseries, telemetry hardware, and local steward stipends. The remaining 6% covers independent financial auditing and open-data platform hosting."},{"sort_order":2,"published":true,"category":"Volunteering","question":"Can I join a field initiative like the Beach Cleanup or Tree Planting without prior scientific training?","answer":"Yes! While our core telemetry is run by field scientists, all four annual initiatives include structured 90-minute safety and ecological orientation sessions on site so first-time volunteers can contribute safely and effectively."},{"sort_order":3,"published":true,"category":"Verification","question":"How does Verdantra verify tree survival and pollution removal metrics?","answer":"Every planted sapling batch and lagoon cleanup is geotagged and audited at 6, 18, and 36 months using multispectral drone imagery and independent university ecology partners."},{"sort_order":4,"published":true,"category":"Partnerships","question":"Do you partner with schools, universities, or corporate sustainability teams?","answer":"We regularly host university field courses, supply open hydrological datasets to researchers, and structure custom watershed sponsorship blocks for organizations committed to science-backed restoration."}]'::jsonb)
where not exists (select 1 from public.faqs);

insert into public.partners (sort_order, published, name, region, url)
select sort_order, published, name, region, url
from jsonb_populate_recordset(null::public.partners, '[{"sort_order":1,"published":true,"name":"Andean Cryosphere Institute","region":"South America","url":"https://example.org/cryosphere"},{"sort_order":2,"published":true,"name":"Pacific Estuary Observatory","region":"Pacific Rim","url":"https://example.org/estuary"},{"sort_order":3,"published":true,"name":"Open Earth Telemetry Lab","region":"Global","url":"https://example.org/telemetry"},{"sort_order":4,"published":true,"name":"Highland Seed Bank Alliance","region":"Cordillera","url":"https://example.org/seedbank"},{"sort_order":5,"published":true,"name":"Blue Carbon Ledger Consortium","region":"International","url":"https://example.org/bluecarbon"}]'::jsonb)
where not exists (select 1 from public.partners);

-- 3. Sample Inbox Submissions
insert into public.messages (name, email, phone, subject, message, status, created_at)
select name, email, phone, subject, message, status, created_at
from jsonb_populate_recordset(null::public.messages, '[{"name":"Dr. Clara Jiménez","email":"c.jimenez@uni-hydrology.edu","phone":"+56 2 2489 1102","subject":"University Telemetry Data Collaboration","message":"Our glaciology department would love to integrate our high-altitude weather station feeds with Verdantra’s Salar Basin dashboard.","status":"unread","created_at":"2026-10-29T14:22:00Z"},{"name":"Henrik Sorensen","email":"hsorensen@nordicgreen.org","phone":"+45 33 14 90 88","subject":"Corporate Sponsorship — Coastal Cleanup","message":"We would like to underwrite two solar interceptor skimmers for the upcoming May 29 coastal cleanup initiative.","status":"read","created_at":"2026-10-25T09:15:00Z"}]'::jsonb)
where not exists (select 1 from public.messages);

insert into public.donations (donor_name, email, amount, frequency, tier_name, focus_area, notes, status, created_at)
select donor_name, email, amount, frequency, tier_name, focus_area, notes, status, created_at
from jsonb_populate_recordset(null::public.donations, '[{"donor_name":"Evelyn Vance","email":"evelyn@vancefoundation.org","amount":250,"frequency":"monthly","tier_name":"Biosphere Patron","focus_area":"Glacier Melting","notes":"Dedicated to the Southern Cryosphere & Bofedales Sponge Network.","status":"confirmed","created_at":"2026-10-30T18:40:00Z"},{"donor_name":"Liam O’Connor","email":"liam.oconnor@proton.me","amount":95,"frequency":"monthly","tier_name":"Watershed Guardian","focus_area":"Ocean Pollution","notes":"Keep up the incredible lagoon restoration work!","status":"pending","created_at":"2026-10-31T11:05:00Z"}]'::jsonb)
where not exists (select 1 from public.donations);

insert into public.volunteers (full_name, email, phone, initiative, availability, skills, status, created_at)
select full_name, email, phone, initiative, availability, skills, status, created_at
from jsonb_populate_recordset(null::public.volunteers, '[{"full_name":"Camila Rojas","email":"camila.rojas@ecology.cl","phone":"+56 9 8741 2309","initiative":"Beach cleanup","availability":"May 2026 Expedition","skills":"Marine biology sampling, kayak safety, Spanish/English translation","status":"new","created_at":"2026-10-30T16:12:00Z"},{"full_name":"Jonas Weber","email":"j.weber@ETH-alumni.ch","phone":"+41 44 632 11 90","initiative":"Tree planting","availability":"March 2026 Expedition","skills":"GIS mapping, drone photogrammetry, high-altitude trekking","status":"approved","created_at":"2026-10-27T10:30:00Z"}]'::jsonb)
where not exists (select 1 from public.volunteers);

insert into public.subscribers (email, source, status, created_at)
select email, source, status, created_at
from jsonb_populate_recordset(null::public.subscribers, '[{"email":"maya.lin@biosphere-journal.org","source":"hero_form","status":"active","created_at":"2026-10-31T08:19:00Z"},{"email":"david.kim@cleanwatershed.io","source":"footer_newsletter","status":"active","created_at":"2026-10-29T21:45:00Z"},{"email":"sophie.laurent@climatetech.eu","source":"hero_form","status":"active","created_at":"2026-10-28T13:10:00Z"}]'::jsonb)
where not exists (select 1 from public.subscribers);
