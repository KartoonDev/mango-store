"use client";

import { ProductCard } from "@/components/ProductCard";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { sampleProducts } from "@/lib/sample-data";
import type { Product } from "@/lib/types";
import { Leaf, Truck } from "lucide-react";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>(sampleProducts);

  useEffect(() => {
    async function loadProducts() {
      if (!supabase) return;
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .gt("stock", 0)
        .order("created_at", { ascending: false });

      if (data?.length) {
        setProducts(data as Product[]);
      }
    }

    loadProducts();
  }, []);

  return (
    <main>
      <section className="relative overflow-hidden bg-leaf text-white">
        <img
          src="https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=1800&q=80"
          alt="มะม่วงน้ำดอกไม้สด"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="relative mx-auto grid min-h-[520px] max-w-6xl content-center gap-6 px-4 py-16">
          <div className="max-w-2xl">
            <p className="mb-3 inline-flex items-center gap-2 rounded-md bg-white/15 px-3 py-2 text-sm font-semibold backdrop-blur">
              <Leaf size={16} />
              เก็บสดจากสวนตามรอบตัด
            </p>
            <h1 className="text-4xl font-bold leading-tight sm:text-6xl">สวนมะม่วงน้ำดอกไม้</h1>
            <p className="mt-5 max-w-xl text-lg text-white/90">
              สั่งมะม่วงคัดเกรด เลือกวันรับเองหรือนัดส่ง พร้อมแนบสลิปโอนเงินในระบบเดียว
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-bold text-stone-950">สินค้าในสวน</h2>
            <p className="mt-1 text-sm text-stone-600">
              {isSupabaseConfigured
                ? "เชื่อมต่อ Supabase แล้ว ข้อมูลจะมาจากฐานข้อมูลจริง"
                : "กำลังใช้ข้อมูลตัวอย่าง เติมค่า Supabase env เพื่อเปิดใช้ฐานข้อมูลจริง"}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm text-stone-700 shadow-sm">
            <Truck size={16} />
            รับเอง / นัดส่งตามวันที่เลือก
          </div>
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
