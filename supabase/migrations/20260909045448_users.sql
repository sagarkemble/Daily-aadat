-- App profile table (passwords stay in auth.users)
create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  email text unique,
  avatar_url text,
  auth_source text not null check (auth_source in ('email', 'google')),
  onboarding_complete boolean not null default false,
  onboarded_at timestamptz,
  onboarding_answers jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.users enable row level security;

create policy "Users can select own row"
on public.users
for select
to authenticated
using (auth.uid() = id);

create policy "Users can update own row"
on public.users
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- Auto-create public.users when auth.users gets a new signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, display_name, auth_source, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name'
    ),
    case
      when new.raw_app_meta_data ->> 'provider' = 'google' then 'google'
      else 'email'
    end,
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();