"use client";

import { ProductCard } from "@/components/ProductCard";
import { ProductGridSkeleton } from "@/components/Skeleton";
import {
  defaultSiteContent,
  defaultStoreSettings,
  type SiteContent,
  type StoreSettings
} from "@/lib/site-config";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { sampleProducts } from "@/lib/sample-data";
import type { Product, SiteContentRow } from "@/lib/types";
import { Award, Box, Gift, Leaf, MapPinned, Megaphone, Recycle, Star, Truck } from "lucide-react";
import { useEffect, useState } from "react";

const conceptItems = [
  {
    title: "คัดสรรพรีเมียม",
    subtitle: "Premium Selection",
    icon: Award,
    image:
      "https://images.unsplash.com/photo-1597528662465-55ece5734101?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "บรรจุภัณฑ์ย่อย",
    subtitle: "Individual Packs",
    icon: Box,
    image:
      "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "รักษ์โลก",
    subtitle: "Eco-Friendly",
    icon: Recycle,
    image:
      "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "ส่งทั่วไทย",
    subtitle: "Nationwide Delivery",
    icon: MapPinned,
    image:
      "https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=900&q=80"
  }
];

const giftingMoments = [
  { title: "Birthday", label: "วันเกิด", icon: Gift },
  { title: "Congratulations", label: "แสดงความยินดี", icon: Star },
  { title: "Gratitude", label: "ขอบคุณ", icon: Leaf }
];

const testimonials = [
  "แพ็กสวยมาก มะม่วงหอมหวาน เหมาะกับส่งเป็นของฝาก",
  "รับเองตามรอบตัด สินค้าสดและจัดการออเดอร์ไว",
  "ลูกค้าปลายทางประทับใจ กล่องดูพรีเมียมกว่าที่คิด"
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [settings, setSettings] = useState<StoreSettings>(defaultStoreSettings);
  const [isLoadingProducts, setIsLoadingProducts] = useState(isSupabaseConfigured);

  useEffect(() => {
    async function loadStorefront() {
      if (!supabase) {
        setIsLoadingProducts(false);
        return;
      }

      const [{ data: productData }, { data: contentData }, { data: settingsData }] = await Promise.all([
        supabase.from("products").select("*").eq("is_active", true).gt("stock", 0).order("created_at", { ascending: false }),
        supabase.from("site_content").select("key,value"),
        supabase.from("store_settings").select("*").eq("id", "default").single()
      ]);

      if (productData?.length) {
        setProducts(productData as Product[]);
      }

      if (contentData?.length) {
        const nextContent = { ...defaultSiteContent };
        for (const row of contentData as SiteContentRow[]) {
          if (row.key in nextContent) {
            nextContent[row.key as keyof SiteContent] = row.value;
          }
        }
        setContent(nextContent);
      }

      if (settingsData) {
        setSettings({ ...defaultStoreSettings, ...(settingsData as StoreSettings) });
      }
      setIsLoadingProducts(false);
    }

    loadStorefront();
  }, []);

  return (
    <main className="bg-[#fffaf0]">
      <section className="relative overflow-hidden bg-leaf text-white">
        <img
          src={content.hero_image_url}
          alt="มะม่วงน้ำดอกไม้สด"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-leaf/55" />
        <div className="relative mx-auto grid min-h-[520px] max-w-7xl content-center gap-6 px-4 py-16">
          <div className="max-w-2xl">
            <p className="mb-3 inline-flex items-center gap-2 rounded-md bg-cream/20 px-3 py-2 text-sm font-semibold backdrop-blur">
              <Leaf size={16} />
              {content.hero_badge}
            </p>
            <h1 className="text-4xl font-bold leading-tight sm:text-6xl">
              รสชาติของความสุข
              <span className="block">ในรูปแบบพรีเมียม</span>
            </h1>
            <p className="mt-3 text-xl font-semibold text-cream">{content.hero_title}</p>
            <p className="mt-4 max-w-xl text-lg text-white/90">{content.hero_subtitle}</p>
            <a
              href="/selection"
              className="mt-6 inline-flex h-11 items-center rounded-full bg-cream px-6 text-sm font-bold text-leaf shadow-soft hover:bg-white"
            >
              Shop Now / สั่งเลย
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        {settings.announcement && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-mint bg-cream p-4 text-bark">
            <Megaphone className="mt-0.5 shrink-0" size={18} />
            <div>
              <p className="font-semibold">{settings.accept_orders ? "เปิดรับออเดอร์" : "ปิดรับออเดอร์ชั่วคราว"}</p>
              <p className="mt-1 text-sm">{settings.announcement}</p>
            </div>
          </div>
        )}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-stone-950">The Concept: Perfection in a Box</h2>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {conceptItems.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="overflow-hidden rounded-lg bg-white shadow-sm">
                <div className="relative h-36">
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-leaf/35" />
                  <div className="absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-cream text-leaf">
                    <Icon size={19} />
                  </div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-bold text-stone-950">{item.title}</h3>
                  <p className="text-sm text-stone-500">{item.subtitle}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="selection" className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-3xl font-bold text-stone-950">{content.products_heading}</h2>
            <p className="mt-1 text-sm text-stone-600">
              {isSupabaseConfigured ? content.products_note : "กำลังใช้ข้อมูลตัวอย่าง เติมค่า Supabase env เพื่อเปิดใช้ฐานข้อมูลจริง"}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm text-stone-700 shadow-sm">
            <Truck size={16} />
            {settings.pickup_note || content.promo_text}
          </div>
        </div>
        {isLoadingProducts ? (
          <ProductGridSkeleton count={3} />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section id="gifting" className="grid bg-white lg:grid-cols-2">
        <div className="min-h-[420px]">
          <img
            src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1400&q=80"
            alt="Gift box"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="grid content-center px-4 py-12 sm:px-10">
          <p className="text-sm font-semibold text-grove">Gifting & Moments</p>
          <h2 className="mt-2 text-3xl font-bold text-stone-950">ของขวัญจากสวนที่ดูดีตั้งแต่แรกเห็น</h2>
          <p className="mt-4 max-w-xl text-stone-600">
            เหมาะสำหรับส่งแทนคำขอบคุณ ของฝากผู้ใหญ่ ลูกค้าองค์กร หรือช่วงเทศกาลที่ต้องการความพรีเมียมแต่ยังอบอุ่นแบบสวนไทย
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {giftingMoments.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-lg border border-stone-200 bg-[#fffaf0] p-4 text-center">
                  <Icon className="mx-auto text-leaf" size={26} />
                  <p className="mt-3 font-bold text-stone-950">{item.title}</p>
                  <p className="text-xs text-stone-500">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="story" className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold text-grove">From the Farm to Your Table</p>
          <h2 className="mt-2 text-3xl font-bold text-stone-950">จากสวนมะม่วงสู่โต๊ะของคุณ</h2>
          <p className="mt-4 text-stone-600">
            เราคัดมะม่วงตามรอบตัดจริง ดูแลความสุก แพ็กอย่างระมัดระวัง และจัดการออเดอร์ผ่านระบบหลังบ้าน เพื่อให้ทุกกล่องส่งถึงลูกค้าอย่างเป็นระเบียบ
          </p>
          <a
            href="/selection"
            className="mt-6 inline-flex h-10 items-center rounded-full bg-leaf px-5 text-sm font-semibold text-white hover:bg-bark"
          >
            เลือกสินค้า
          </a>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <img
            src="https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=900&q=80"
            alt="Mango farm"
            className="h-64 w-full rounded-lg object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=900&q=80"
            alt="Farm landscape"
            className="h-64 w-full rounded-lg object-cover"
          />
        </div>
      </section>

      <section className="bg-cream px-4 py-12">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-3xl font-bold text-stone-950">Happy Customers</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {testimonials.map((quote) => (
              <blockquote key={quote} className="rounded-lg bg-white p-5 text-sm text-stone-600 shadow-sm">
                <div className="mb-3 flex justify-center gap-1 text-leaf">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={14} fill="currentColor" />
                  ))}
                </div>
                “{quote}”
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <footer id="contact" className="border-t border-leaf/10 bg-white px-4 py-10">
        <div className="mx-auto grid max-w-7xl gap-8 text-sm text-stone-600 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-bold text-leaf">สวนมะม่วงน้ำดอกไม้</h3>
            <p className="mt-2">Little Orchard Online Store</p>
          </div>
          <div>
            <p className="font-bold text-stone-950">About</p>
            <p className="mt-2">Premium mango selection</p>
            <p>Eco-friendly packaging</p>
          </div>
          <div>
            <p className="font-bold text-stone-950">Contact Us</p>
            <p className="mt-2">{settings.contact_phone || "เพิ่มเบอร์โทรในหลังบ้าน"}</p>
            <p>{settings.contact_line || "เพิ่ม Line ในหลังบ้าน"}</p>
          </div>
          <div>
            <p className="font-bold text-stone-950">Payment</p>
            <p className="mt-2">{settings.bank_name || "โอนเงินและแนบสลิป"}</p>
            <p>{settings.bank_account_number}</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
