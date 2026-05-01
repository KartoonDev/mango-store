"use client";

import { useCart } from "@/components/CartProvider";
import { defaultProductImage, sampleProducts } from "@/lib/sample-data";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/lib/types";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(
    sampleProducts.find((item) => item.id === params.id) || null
  );

  useEffect(() => {
    async function loadProduct() {
      if (!supabase) return;
      const { data } = await supabase.from("products").select("*").eq("id", params.id).single();
      if (data) setProduct(data as Product);
    }

    loadProduct();
  }, [params.id]);

  if (!product) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-stone-600">ไม่พบสินค้า</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-leaf">
        <ArrowLeft size={16} />
        กลับหน้าร้าน
      </Link>
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <img
          src={product.image_url || defaultProductImage}
          alt={product.name}
          className="h-[420px] w-full rounded-lg object-cover shadow-soft"
        />
        <div className="flex flex-col justify-center">
          <p className="text-sm font-semibold text-bark">มะม่วงน้ำดอกไม้จากสวน</p>
          <h1 className="mt-2 text-3xl font-bold text-stone-950">{product.name}</h1>
          <p className="mt-4 text-stone-600">{product.description}</p>
          <div className="mt-6 rounded-lg border border-stone-200 bg-white p-5">
            <p className="text-3xl font-bold text-leaf">฿{product.price.toLocaleString("th-TH")}</p>
            <p className="mt-1 text-sm text-stone-500">
              ต่อ {product.unit} · เหลือ {product.stock} {product.unit}
            </p>
            <button
              type="button"
              onClick={() => addItem(product)}
              className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-mango px-4 font-bold text-stone-950 hover:bg-yellow-400"
            >
              <ShoppingCart size={18} />
              เพิ่มลงตะกร้า
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
