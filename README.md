# Mango Store

เว็บร้านสวนมะม่วงน้ำดอกไม้สำหรับสั่งซื้อผ่านตะกร้า แนบสลิปโอนเงิน และจัดการสินค้า/ออเดอร์/ยอดขายผ่านหลังบ้าน

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Postgres, Auth, Storage
- Deploy ง่ายผ่าน Vercel

## เริ่มใช้งานบนเครื่อง

```bash
npm install
npm run dev
```

เปิดเว็บที่ `http://localhost:3000`

ถ้ายังไม่ตั้งค่า Supabase เว็บจะแสดงข้อมูลตัวอย่างและไม่บันทึกออเดอร์จริง

## ตั้งค่า Supabase

1. สร้าง Supabase project ผ่าน Vercel Marketplace หรือที่ Supabase โดยตรง
2. เปิด Supabase SQL Editor แล้วรันไฟล์ `supabase/schema.sql`
3. คัดลอก `.env.example` เป็น `.env.local`
4. เติมค่า:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## สร้างแอดมินคนแรก

1. ไปที่ Supabase Auth แล้วสร้าง user ด้วยอีเมล/รหัสผ่าน
2. คัดลอก user id
3. รัน SQL นี้ โดยแทนค่า id/email ของคุณ

```sql
insert into public.profiles (id, email, role)
values ('USER_ID_FROM_AUTH', 'you@example.com', 'owner');
```

หลังจากนั้นเข้าสู่ระบบที่ `/admin/login`

## Deploy ผ่าน Vercel

1. Push โปรเจกต์ขึ้น GitHub
2. Import repo ใน Vercel
3. ติดตั้ง Supabase integration จาก Vercel Marketplace
4. ตรวจว่า environment variables ถูก sync เข้ามาใน Vercel project
5. Deploy

## หน้าจอหลัก

- `/` หน้าร้านและรายการสินค้า
- `/product/[id]` รายละเอียดสินค้า
- `/checkout` ตะกร้าและฟอร์มสั่งซื้อ
- `/admin/login` ล็อกอินหลังบ้าน
- `/admin` ภาพรวม
- `/admin/products` จัดการสินค้า
- `/admin/orders` จัดการออเดอร์
- `/admin/sales` สรุปยอดขาย
