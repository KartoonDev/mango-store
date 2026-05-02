create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'staff' check (role in ('owner', 'staff')),
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  price numeric(10, 2) not null check (price >= 0),
  unit text not null default 'กก.',
  stock integer not null default 0 check (stock >= 0),
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_phone text not null,
  pickup_method text not null check (pickup_method in ('pickup', 'delivery')),
  pickup_date date not null,
  delivery_address text,
  note text,
  total_amount numeric(10, 2) not null check (total_amount >= 0),
  slip_url text,
  status text not null default 'pending_payment_review'
    check (status in ('pending_payment_review', 'paid', 'preparing', 'ready', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  line_total numeric(10, 2) not null check (line_total >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.site_content (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.store_settings (
  id text primary key default 'default',
  accept_orders boolean not null default true,
  announcement text not null default '',
  pickup_note text not null default '',
  contact_phone text not null default '',
  contact_line text not null default '',
  contact_facebook text not null default '',
  bank_account_name text not null default '',
  bank_account_number text not null default '',
  bank_name text not null default '',
  qr_image_url text not null default '',
  updated_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_touch_updated_at on public.products;
create trigger products_touch_updated_at
before update on public.products
for each row execute function public.touch_updated_at();

drop trigger if exists orders_touch_updated_at on public.orders;
create trigger orders_touch_updated_at
before update on public.orders
for each row execute function public.touch_updated_at();

drop trigger if exists site_content_touch_updated_at on public.site_content;
create trigger site_content_touch_updated_at
before update on public.site_content
for each row execute function public.touch_updated_at();

drop trigger if exists store_settings_touch_updated_at on public.store_settings;
create trigger store_settings_touch_updated_at
before update on public.store_settings
for each row execute function public.touch_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('owner', 'staff')
  );
$$;

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.site_content enable row level security;
alter table public.store_settings enable row level security;

drop policy if exists "users can read own profile" on public.profiles;
create policy "users can read own profile"
on public.profiles for select
to authenticated
using (id = auth.uid());

drop policy if exists "admins can read profiles" on public.profiles;
drop policy if exists "owners can manage profiles" on public.profiles;

drop policy if exists "public can read active products" on public.products;
create policy "public can read active products"
on public.products for select
to anon, authenticated
using (is_active = true and stock > 0);

drop policy if exists "admins can manage products" on public.products;
create policy "admins can manage products"
on public.products for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "public can create orders" on public.orders;
create policy "public can create orders"
on public.orders for insert
to anon, authenticated
with check (true);

drop policy if exists "admins can manage orders" on public.orders;
create policy "admins can manage orders"
on public.orders for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "public can create order items" on public.order_items;
create policy "public can create order items"
on public.order_items for insert
to anon, authenticated
with check (true);

drop policy if exists "admins can read order items" on public.order_items;
create policy "admins can read order items"
on public.order_items for select
to authenticated
using (public.is_admin());

drop policy if exists "public can read site content" on public.site_content;
create policy "public can read site content"
on public.site_content for select
to anon, authenticated
using (true);

drop policy if exists "admins can manage site content" on public.site_content;
create policy "admins can manage site content"
on public.site_content for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "public can read store settings" on public.store_settings;
create policy "public can read store settings"
on public.store_settings for select
to anon, authenticated
using (true);

drop policy if exists "admins can manage store settings" on public.store_settings;
create policy "admins can manage store settings"
on public.store_settings for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('payment-slips', 'payment-slips', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "public can upload payment slips" on storage.objects;
create policy "public can upload payment slips"
on storage.objects for insert
to anon, authenticated
with check (bucket_id = 'payment-slips');

drop policy if exists "public can view payment slips" on storage.objects;
create policy "public can view payment slips"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'payment-slips');

insert into public.products (name, description, price, unit, stock, image_url, is_active)
values
  (
    'มะม่วงน้ำดอกไม้สีทอง เกรดพรีเมียม',
    'ผลสวย เนื้อแน่น หวานหอม เหมาะสำหรับรับประทานสุกหรือเป็นของฝาก',
    129,
    'กก.',
    80,
    'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=1200&q=80',
    true
  ),
  (
    'มะม่วงน้ำดอกไม้คัดกล่อง',
    'คัดขนาดใกล้เคียงกัน แพ็กกล่องพร้อมส่ง เหมาะสำหรับลูกค้าองค์กร',
    590,
    'กล่อง 5 กก.',
    24,
    'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=1200&q=80',
    true
  )
on conflict do nothing;

insert into public.site_content (key, value)
values
  ('hero_badge', 'เก็บสดจากสวนตามรอบตัด'),
  ('hero_title', 'สวนมะม่วงน้ำดอกไม้'),
  ('hero_subtitle', 'สั่งมะม่วงคัดเกรด เลือกวันรับเองหรือนัดส่ง พร้อมแนบสลิปโอนเงินในระบบเดียว'),
  ('hero_image_url', 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=1800&q=80'),
  ('products_heading', 'สินค้าในสวน'),
  ('products_note', 'มะม่วงสดจากสวน คัดเกรดตามรอบตัด'),
  ('promo_text', 'รับเอง / นัดส่งตามวันที่เลือก')
on conflict (key) do nothing;

insert into public.store_settings (
  id,
  accept_orders,
  announcement,
  pickup_note
)
values (
  'default',
  true,
  'เปิดรับออเดอร์มะม่วงน้ำดอกไม้ตามรอบตัดประจำสัปดาห์',
  'รับเองที่สวนหรือนัดส่งตามวันที่เลือก'
)
on conflict (id) do nothing;
