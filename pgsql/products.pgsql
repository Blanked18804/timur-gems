-- PRODUCTS TABLE
create table public.products (
  id uuid primary key default gen_random_uuid(),

  -- Basic information
  name text not null,
  slug text not null unique,
  description text,

  -- Gemstone information
  stone_type text not null,
  shape text not null,
  cut text not null,
  color text not null,
  weight numeric(10, 2),

  -- Dimensions (mm)
  length_mm numeric(10, 2),
  width_mm numeric(10, 2),
  height_mm numeric(10, 2),

  -- Gemstone characteristics
  clarity text,
  origin text,
  treatment text,
  hardness numeric(3, 1),
  is_natural boolean not null default true,

  -- Pricing
  price numeric(12, 2) not null,
  discount_price numeric(12, 2),

  -- Inventory
  stock_quantity integer not null default 1,
  is_available boolean not null default true,

  -- Storefront
  is_featured boolean not null default false,
  is_active boolean not null default true,

  -- Timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Constraints
  constraint products_price_positive
    check (price >= 0),

  constraint products_discount_positive
    check (
      discount_price is null
      or discount_price >= 0
    ),

  constraint products_discount_less_than_price
    check (
      discount_price is null
      or discount_price < price
    ),

  constraint products_stock_non_negative
    check (stock_quantity >= 0),

  constraint products_weight_positive
    check (
      weight is null
      or weight > 0
    ),

  constraint products_dimensions_positive
    check (
      (length_mm is null or length_mm > 0)
      and
      (width_mm is null or width_mm > 0)
      and
      (height_mm is null or height_mm > 0)
    ),

  constraint products_hardness_valid
    check (
      hardness is null
      or (hardness >= 0 and hardness <= 10)
    )
);


-- PRODUCT IMAGES TABLE
create table public.product_images (
  id uuid primary key default gen_random_uuid(),

  product_id uuid not null
    references public.products(id)
    on delete cascade,

  image_url text not null,
  alt_text text,

  sort_order integer not null default 0,
  is_primary boolean not null default false,

  created_at timestamptz not null default now()
);


-- ============================================
-- INDEXES
-- ============================================

-- create index products_stone_type_idx
--   on public.products(stone_type);

-- create index products_shape_idx
--   on public.products(shape);

-- create index products_cut_idx
--   on public.products(cut);

-- create index products_color_idx
--   on public.products(color);

-- create index products_price_idx
--   on public.products(price);

-- create index products_featured_idx
--   on public.products(is_featured)
--   where is_featured = true;

-- create index products_active_idx
--   on public.products(is_active)
--   where is_active = true;

-- create index product_images_product_id_idx
--   on public.product_images(product_id);

-- create index product_images_sort_order_idx
--   on public.product_images(product_id, sort_order);


-- AUTO UPDATE updated_at
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


create trigger products_updated_at
before update on public.products
for each row
execute function public.update_updated_at();