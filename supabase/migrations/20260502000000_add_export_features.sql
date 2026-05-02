create table if not exists public.export_prices (
  id uuid primary key default gen_random_uuid(),
  variety text not null,
  grade text not null,
  size_label text not null default '',
  destination text not null default '',
  price_min numeric(10, 2) not null check (price_min >= 0),
  price_max numeric(10, 2) not null check (price_max >= price_min),
  unit text not null default 'กก.',
  status text not null default 'open' check (status in ('open', 'pending', 'closed')),
  effective_date date not null default current_date,
  note text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.farmer_partners (
  id uuid primary key default gen_random_uuid(),
  farm_name text not null,
  contact_name text not null,
  phone text not null,
  line_id text,
  province text not null,
  district text,
  varieties text not null,
  volume_kg numeric(12, 2),
  harvest_window text not null,
  has_gap boolean not null default false,
  certification_note text,
  photo_url text,
  note text,
  admin_note text,
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'paused', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists export_prices_touch_updated_at on public.export_prices;
create trigger export_prices_touch_updated_at
before update on public.export_prices
for each row execute function public.touch_updated_at();

drop trigger if exists farmer_partners_touch_updated_at on public.farmer_partners;
create trigger farmer_partners_touch_updated_at
before update on public.farmer_partners
for each row execute function public.touch_updated_at();

alter table public.export_prices enable row level security;
alter table public.farmer_partners enable row level security;

drop policy if exists "public can read active export prices" on public.export_prices;
create policy "public can read active export prices"
on public.export_prices for select
to anon, authenticated
using (is_active = true);

drop policy if exists "admins can manage export prices" on public.export_prices;
create policy "admins can manage export prices"
on public.export_prices for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "public can create farmer partners" on public.farmer_partners;
create policy "public can create farmer partners"
on public.farmer_partners for insert
to anon, authenticated
with check (true);

drop policy if exists "admins can manage farmer partners" on public.farmer_partners;
create policy "admins can manage farmer partners"
on public.farmer_partners for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('farmer-photos', 'farmer-photos', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "public can upload farmer photos" on storage.objects;
create policy "public can upload farmer photos"
on storage.objects for insert
to anon, authenticated
with check (bucket_id = 'farmer-photos');

drop policy if exists "public can view farmer photos" on storage.objects;
create policy "public can view farmer photos"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'farmer-photos');

insert into public.export_prices (
  variety,
  grade,
  size_label,
  destination,
  price_min,
  price_max,
  unit,
  status,
  effective_date,
  note,
  is_active
)
select *
from (
  values
    (
      'น้ำดอกไม้สีทอง',
      'เกรด A ส่งออก',
      '280-420 กรัม/ผล',
      'จีน / ฮ่องกง',
      42::numeric,
      58::numeric,
      'กก.',
      'open',
      current_date,
      'ผลผิวสวย ไม่มีช้ำ คัดแก่จัดตามรอบตัด',
      true
    ),
    (
      'น้ำดอกไม้เบอร์ 4',
      'เกรด B',
      '250-450 กรัม/ผล',
      'มาเลเซีย / สิงคโปร์',
      30::numeric,
      42::numeric,
      'กก.',
      'open',
      current_date,
      'รับเฉพาะผลแก่ สีสม่ำเสมอ เหมาะคัดกล่อง',
      true
    ),
    (
      'มะม่วงมัน / เขียวเสวย',
      'คัดไซซ์',
      'ตามล็อต',
      'ตลาดรวมส่งออก',
      18::numeric,
      28::numeric,
      'กก.',
      'pending',
      current_date,
      'รอยืนยันรอบรับซื้อถัดไป',
      true
    )
) as seed(
  variety,
  grade,
  size_label,
  destination,
  price_min,
  price_max,
  unit,
  status,
  effective_date,
  note,
  is_active
)
where not exists (select 1 from public.export_prices);
