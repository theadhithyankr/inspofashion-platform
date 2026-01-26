-- CRITICAL FIX: Remove the circular dependency policy
-- The "Admins can view all profiles" policy causes a 500 error because it creates infinite recursion

-- 1. Drop ALL existing policies
drop policy if exists "Users can view own profile" on profiles;
drop policy if exists "Users can update own profile" on profiles;
drop policy if exists "Users can insert own profile" on profiles;
drop policy if exists "Admins can view all profiles" on profiles;

-- 2. Re-enable RLS
alter table profiles enable row level security;

-- 3. Create ONLY the safe policies (no circular dependency)
create policy "Users can view own profile"
on profiles for select
using ( auth.uid() = id );

create policy "Users can update own profile"
on profiles for update
using ( auth.uid() = id );

create policy "Users can insert own profile"
on profiles for insert
with check ( auth.uid() = id );

-- NOTE: We are NOT creating the "Admins can view all profiles" policy
-- because it causes a 500 error due to circular dependency.
-- Admins will only see their own profile in the app for now.
-- For admin features that need to see all users, we'll use service role key later.
