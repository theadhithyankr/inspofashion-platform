
-- Create the storage bucket 'products'
insert into storage.buckets (id, name, public)
values ('products', 'products', true);

-- Policy to allow anyone to select (view) images
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'products' );

-- Policy to allow authenticated admins to insert (upload) images
create policy "Admin Upload"
  on storage.objects for insert
  with check (
    bucket_id = 'products' 
    and auth.role() = 'authenticated' 
    and exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Policy to allow authenticated admins to update images
create policy "Admin Update"
  on storage.objects for update
  using (
    bucket_id = 'products' 
    and auth.role() = 'authenticated' 
    and exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Policy to allow authenticated admins to delete images
create policy "Admin Delete"
  on storage.objects for delete
  using (
    bucket_id = 'products' 
    and auth.role() = 'authenticated' 
    and exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );
