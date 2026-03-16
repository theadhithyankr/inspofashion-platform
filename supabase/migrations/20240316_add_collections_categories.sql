-- Create Categories Table
CREATE TABLE public.categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Collections Table
CREATE TABLE public.collections (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Junction Table for Product <-> Collection
CREATE TABLE public.product_collections (
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  collection_id uuid REFERENCES public.collections(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, collection_id)
);

-- RLS Policies
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_collections ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Collections are viewable by everyone" ON public.collections FOR SELECT USING (true);
CREATE POLICY "Product collections are viewable by everyone" ON public.product_collections FOR SELECT USING (true);

-- Admin write access
CREATE POLICY "Admins can manage categories" ON public.categories USING (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);

CREATE POLICY "Admins can manage collections" ON public.collections USING (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);

CREATE POLICY "Admins can manage product_collections" ON public.product_collections USING (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);

-- Add sizes to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sizes text[] DEFAULT array['XS','S','M','L','XL','XXL'];
