-- ============================================================
-- Schema database untuk PRD.md section 6 + 7
-- Sprint 1 — Database & RLS
-- Jalankan dengan role postgres (service role / SQL editor)
-- ============================================================

-- ---------- TABLES ----------

-- profile: single row pemilik. id = auth.users.id
create table if not exists public.profile (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  tagline text,
  bio text,
  avatar_url text,
  cv_url text,
  email text,
  social_links jsonb,
  is_admin boolean not null default false,
  singleton boolean not null default true,
  updated_at timestamptz not null default now(),
  constraint profile_single_row unique (singleton)
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  tech_stack text[],
  image_url text,
  demo_url text,
  repo_url text,
  is_featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  level smallint not null default 3 check (level between 1 and 5),
  icon text,
  sort_order int not null default 0
);

create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text not null,
  description text,
  start_date date,
  end_date date,
  sort_order int not null default 0
);

create table if not exists public.educations (
  id uuid primary key default gen_random_uuid(),
  school text not null,
  degree text,
  start_date date,
  end_date date,
  sort_order int not null default 0
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- TRIGGER: profile.updated_at ----------

create or replace function public.handle_profile_updated_at()
returns trigger
language plpgsql
security invoker
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profile_updated_at on public.profile;
create trigger trg_profile_updated_at
before update on public.profile
for each row execute function public.handle_profile_updated_at();

-- ---------- RLS ----------

alter table public.profile     enable row level security;
alter table public.projects    enable row level security;
alter table public.skills      enable row level security;
alter table public.experiences enable row level security;
alter table public.educations  enable row level security;
alter table public.messages    enable row level security;

-- helper: admin = authenticated user yang profile-nya is_admin = true
-- (profile dibaca publik, sehingga subquery aman untuk dijalankan oleh pemanggil)

-- profile
drop policy if exists "profile_select" on public.profile;
create policy "profile_select" on public.profile
  for select using (true);

drop policy if exists "profile_insert_admin" on public.profile;
create policy "profile_insert_admin" on public.profile
  for insert to authenticated
  with check (auth.uid() = (select id from public.profile where is_admin = true));

drop policy if exists "profile_update_admin" on public.profile;
create policy "profile_update_admin" on public.profile
  for update to authenticated
  using (auth.uid() = (select id from public.profile where is_admin = true))
  with check (auth.uid() = (select id from public.profile where is_admin = true));

drop policy if exists "profile_delete_admin" on public.profile;
create policy "profile_delete_admin" on public.profile
  for delete to authenticated
  using (auth.uid() = (select id from public.profile where is_admin = true));

-- projects / skills / experiences / educations: public read, admin write
do $$
declare t text;
begin
  foreach t in array array['projects','skills','experiences','educations']
  loop
    execute format('drop policy if exists %I on public.%I', 'select_' || t, t);
    execute format('create policy %I on public.%I for select using (true)', 'select_' || t, t);

    execute format('drop policy if exists %I on public.%I', 'insert_admin_' || t, t);
    execute format('create policy %I on public.%I for insert to authenticated with check (auth.uid() = (select id from public.profile where is_admin = true))', 'insert_admin_' || t, t);

    execute format('drop policy if exists %I on public.%I', 'update_admin_' || t, t);
    execute format('create policy %I on public.%I for update to authenticated using (auth.uid() = (select id from public.profile where is_admin = true)) with check (auth.uid() = (select id from public.profile where is_admin = true))', 'update_admin_' || t, t);

    execute format('drop policy if exists %I on public.%I', 'delete_admin_' || t, t);
    execute format('create policy %I on public.%I for delete to authenticated using (auth.uid() = (select id from public.profile where is_admin = true))', 'delete_admin_' || t, t);
  end loop;
end $$;

-- messages: insert publik, select/update/delete admin
drop policy if exists "messages_select_admin" on public.messages;
create policy "messages_select_admin" on public.messages
  for select to authenticated
  using (auth.uid() = (select id from public.profile where is_admin = true));

drop policy if exists "messages_insert_public" on public.messages;
create policy "messages_insert_public" on public.messages
  for insert to anon, authenticated
  with check (true);

drop policy if exists "messages_update_admin" on public.messages;
create policy "messages_update_admin" on public.messages
  for update to authenticated
  using (auth.uid() = (select id from public.profile where is_admin = true))
  with check (auth.uid() = (select id from public.profile where is_admin = true));

drop policy if exists "messages_delete_admin" on public.messages;
create policy "messages_delete_admin" on public.messages
  for delete to authenticated
  using (auth.uid() = (select id from public.profile where is_admin = true));

-- ---------- GRANTS (Data API) ----------
-- skill: tabel baru tidak otomatis exposed ke Data API; perlu GRANT eksplisit

grant select on table public.profile, public.projects, public.skills,
  public.experiences, public.educations to anon, authenticated;
grant insert, update, delete on table public.profile, public.projects,
  public.skills, public.experiences, public.educations to authenticated;
grant insert on table public.messages to anon, authenticated;
grant select, update, delete on table public.messages to authenticated;
grant all on table public.profile, public.projects, public.skills,
  public.experiences, public.educations, public.messages to service_role;

-- ---------- STORAGE ----------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('project-images', 'project-images', true, 10485760, array['image/jpeg','image/png','image/webp','image/gif','image/avif']),
  ('cv', 'cv', true, 10485760, array['application/pdf'])
on conflict (id) do nothing;

-- read publik untuk bucket asset
drop policy if exists "asset_select_public" on storage.objects;
create policy "asset_select_public" on storage.objects
  for select using (bucket_id in ('project-images', 'cv'));

-- write hanya admin
drop policy if exists "asset_insert_admin" on storage.objects;
create policy "asset_insert_admin" on storage.objects
  for insert to authenticated
  with check (
    bucket_id in ('project-images', 'cv')
    and auth.uid() = (select id from public.profile where is_admin = true)
  );

drop policy if exists "asset_update_admin" on storage.objects;
create policy "asset_update_admin" on storage.objects
  for update to authenticated
  using (
    bucket_id in ('project-images', 'cv')
    and auth.uid() = (select id from public.profile where is_admin = true)
  );

drop policy if exists "asset_delete_admin" on storage.objects;
create policy "asset_delete_admin" on storage.objects
  for delete to authenticated
  using (
    bucket_id in ('project-images', 'cv')
    and auth.uid() = (select id from public.profile where is_admin = true)
  );
