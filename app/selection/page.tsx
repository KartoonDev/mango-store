"use client";

import { ProductCard } from "@/components/ProductCard";
import { defaultSiteContent, defaultStoreSettings, type SiteContent, type StoreSettings } from "@/lib/site-config";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { sampleProducts } from "@/lib/sample-data";
import type { Product, SiteContentRow } from "@/lib/types";
import { PackageCheck, Truck } from "lucide-react";
import { useEffect, useState } from "react";

export default function SelectionPage() {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [settings, setSettings] = useState<StoreSettings>(defaultStoreSettings);

  useEffect(() => {
    async function loadProducts() {
      if (!supabase) return;

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
    }

    loadProducts();
  }, []);

  return (
    <main className="bg-[#fffaf0]">
      <section className="bg-leaf px-4 py-14 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-semibold text-cream">
            <PackageCheck size={16} />
            Our Selection
          </p>
          <h1 className="mt-5 text-4xl font-black md:text-5xl">{content.products_heading}</h1>
          <p className="mt-3 max-w-2xl text-white/82">
            {isSupabaseConfigured ? content.products_note : "กำลังใช้ข้อมูลตัวอย่าง เติมค่า Supabase env เพื่อเปิดใช้ฐานข้อมูลจริง"}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-6 inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm text-stone-700 shadow-sm">
          <Truck size={16} />
          {settings.pickup_note || content.promo_text}
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
