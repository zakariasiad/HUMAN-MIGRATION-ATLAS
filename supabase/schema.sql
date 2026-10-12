-- Human Migration Atlas: initial data model
-- Date convention: periods are expressed in years before present (present = 0).
-- For a range, period_start_years_before_present is the older bound and
-- period_end_years_before_present is the more recent bound.

create extension if not exists pgcrypto;

create table if not exists public.migration_events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  title_ar text not null,
  period_start_years_before_present integer not null check (period_start_years_before_present >= 0),
  period_end_years_before_present integer not null check (period_end_years_before_present >= 0),
  period_precision text not null default 'approximate'
    check (period_precision in ('exact', 'estimated', 'approximate', 'disputed')),
  origin_name text not null,
  origin_name_ar text not null,
  origin_lat double precision not null check (origin_lat between -90 and 90),
  origin_lng double precision not null check (origin_lng between -180 and 180),
  destination_name text not null,
  destination_name_ar text not null,
  destination_lat double precision not null check (destination_lat between -90 and 90),
  destination_lng double precision not null check (destination_lng between -180 and 180),
  layer text not null check (layer in ('human-origins', 'prehistoric', 'historical', 'modern')),
  category text not null,
  category_ar text not null,
  summary text not null,
  summary_ar text not null,
  evidence_notes text not null,
  evidence_notes_ar text not null,
  confidence text not null check (confidence in ('high', 'medium', 'emerging')),
  visualization_color text not null default '#5ce1c6',
  publication_status text not null default 'draft'
    check (publication_status in ('draft', 'published', 'archived')),
  is_illustrative boolean not null default false,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (period_start_years_before_present >= period_end_years_before_present)
);

create index if not exists migration_events_publication_period_idx
  on public.migration_events (publication_status, period_start_years_before_present desc);
create index if not exists migration_events_layer_idx
  on public.migration_events (layer);

create table if not exists public.migration_sources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  authors text,
  publication_year integer,
  publisher text,
  source_url text,
  doi text,
  source_type text not null default 'research'
    check (source_type in ('research', 'dataset', 'archive', 'report', 'book', 'other')),
  license text,
  notes text,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  check (source_url is null or source_url ~ '^https?://'),
  check (doi is null or length(trim(doi)) > 0)
);

create table if not exists public.migration_event_sources (
  migration_event_id uuid not null references public.migration_events(id) on delete cascade,
  migration_source_id uuid not null references public.migration_sources(id) on delete cascade,
  claim_note text,
  primary key (migration_event_id, migration_source_id)
);

create table if not exists public.migration_route_segments (
  id uuid primary key default gen_random_uuid(),
  migration_event_id uuid not null references public.migration_events(id) on delete cascade,
  segment_order integer not null check (segment_order >= 0),
  start_name text,
  start_name_ar text,
  start_lat double precision not null check (start_lat between -90 and 90),
  start_lng double precision not null check (start_lng between -180 and 180),
  end_name text,
  end_name_ar text,
  end_lat double precision not null check (end_lat between -90 and 90),
  end_lng double precision not null check (end_lng between -180 and 180),
  route_note text,
  unique (migration_event_id, segment_order)
);

-- All exposed tables use RLS. Public visitors can only read published stories
-- and public source metadata; no anonymous write policies are created.
alter table public.migration_events enable row level security;
alter table public.migration_sources enable row level security;
alter table public.migration_event_sources enable row level security;
alter table public.migration_route_segments enable row level security;

drop policy if exists "Public can read published migration events" on public.migration_events;
create policy "Public can read published migration events"
  on public.migration_events for select to anon, authenticated
  using (publication_status = 'published');

drop policy if exists "Public can read public sources used by published events" on public.migration_sources;
create policy "Public can read public sources used by published events"
  on public.migration_sources for select to anon, authenticated
  using (
    is_public = true and exists (
      select 1
      from public.migration_event_sources es
      join public.migration_events me on me.id = es.migration_event_id
      where es.migration_source_id = migration_sources.id
        and me.publication_status = 'published'
    )
  );

drop policy if exists "Public can read citations for published events" on public.migration_event_sources;
create policy "Public can read citations for published events"
  on public.migration_event_sources for select to anon, authenticated
  using (exists (
    select 1 from public.migration_events me
    where me.id = migration_event_sources.migration_event_id
      and me.publication_status = 'published'
  ));

drop policy if exists "Public can read segments of published events" on public.migration_route_segments;
create policy "Public can read segments of published events"
  on public.migration_route_segments for select to anon, authenticated
  using (exists (
    select 1 from public.migration_events me
    where me.id = migration_route_segments.migration_event_id
      and me.publication_status = 'published'
  ));

grant usage on schema public to anon, authenticated;
grant select on public.migration_events, public.migration_sources,
  public.migration_event_sources, public.migration_route_segments to anon, authenticated;
