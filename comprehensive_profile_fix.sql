-- COMPREHENSIVE FIX FOR PROFILE CREATION AND RLS
-- Run this entire script in your Supabase SQL Editor

-- Step 1: Drop all existing RLS policies on profiles to start fresh
drop policy if exists "Public profiles are viewable by everyone." on profiles;
drop policy if exists "Users can insert their own profile." on profiles;
drop policy if exists "Users can update own profile." on profiles;
drop policy if exists "Users can view own profile" on profiles;
drop policy if exists "Users can update own profile" on profiles;
drop policy if exists "Users can insert own profile" on profiles;
drop policy if exists "Admins can view all profiles" on profiles;

-- Step 2: Recreate the trigger function with better error handling
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role, created_at, updated_at)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1)
    ),
    'customer',
    now(),
    now()
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, profiles.full_name),
    updated_at = now();
  return new;
end;
$$;

-- Step 3: Ensure the trigger exists
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Step 4: Create simple, non-conflicting RLS policies
alter table profiles enable row level security;

-- Allow users to view their own profile
create policy "Users can view own profile"
on profiles for select
using ( auth.uid() = id );

-- Allow users to update their own profile  
create policy "Users can update own profile"
on profiles for update
using ( auth.uid() = id );

-- Allow the trigger to insert profiles (using security definer)
create policy "Enable insert for authenticated users"
on profiles for insert
to authenticated
with check ( auth.uid() = id );

-- Step 5: Verify - show all current profiles
select email, role, full_name, created_at from profiles order by created_at desc;
