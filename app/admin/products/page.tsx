"use client";

import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { defaultProductImage } from "@/lib/sample-data";
import type { Product } from "@/lib/types";
import { Plus, Save, Trash2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

const emptyProduct = {
  name: "",
  description: "",
  price: 0,
  unit: "กก.",
  stock: 0,
  image_url: "",
  is_active: true
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState("");

  async function loadProducts() {
    if (!supabase) return;
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts((data || []) as Product[]);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    if (!supabase) {
      setMessage("กรุณาตั้งค่า Supabase ก่อนเพิ่มสินค้า");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const { error } = await supabase.from("products").insert({
      name: String(formData.get("name")),
      description: String(formData.get("description")),
      price: Number(formData.get("price")),
      unit: String(formData.get("unit")),
      stock: Number(formData.get("stock")),
      image_url: String(formData.get("image_url") || ""),
      is_active: formData.get("is_active") === "on"
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    event.currentTarget.reset();
    setMessage("เพิ่มสินค้าแล้ว");
    loadProducts();
  }

  async function updateProduct(product: Product, patch: Partial<Product>) {
    if (!supabase) return;
    const { error } = await supabase.from("products").update(patch).eq("id", product.id);
    setMessage(error ? error.message : "บันทึกสินค้าแล้ว");
    loadProducts();
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <form onSubmit={handleCreate} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <h2 className="flex items-center gap-2 text-xl font-bold text-stone-950">
          <Plus size={20} />
          เพิ่มสินค้า
        </h2>
        {!isSupabaseConfigured && <p className="mt-2 text-sm text-stone-500">ต้องตั้งค่า Supabase ก่อนบันทึกจริง</p>}
        <div className="mt-5 grid gap-4">
          {Object.entries(emptyProduct).map(([key, value]) => {
            if (key === "is_active") {
              return (
                <label key={key} className="flex items-center gap-2 text-sm font-semibold text-stone-700">
                  <input name={key} type="checkbox" defaultChecked={Boolean(value)} />
                  เปิดขาย
                </label>
              );
            }
            return (
              <label key={key} className="grid gap-1">
                <span className="label">
                  {key === "image_url" ? "ลิงก์รูปสินค้า" : key === "description" ? "รายละเอียด" : key}
                </span>
                <input
                  name={key}
                  type={typeof value === "number" ? "number" : "text"}
                  step={key === "price" ? "0.01" : undefined}
                  required={key !== "image_url"}
                  className="field"
                />
              </label>
            );
          })}
          <button className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-leaf px-4 font-semibold text-white">
            <Save size={17} />
            บันทึกสินค้า
          </button>
          {message && <p className="rounded-md bg-stone-100 p-3 text-sm text-stone-700">{message}</p>}
        </div>
      </form>

      <div className="space-y-3">
        {products.map((product) => (
          <article key={product.id} className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
            <div className="flex gap-4">
              <img
                src={product.image_url || defaultProductImage}
                alt={product.name}
                className="h-20 w-20 rounded-md object-cover"
              />
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-stone-950">{product.name}</h3>
                <p className="text-sm text-stone-500">
                  ฿{Number(product.price).toLocaleString("th-TH")} / {product.unit} · สต็อก {product.stock}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => updateProduct(product, { is_active: !product.is_active })}
                    className="rounded-md border border-stone-200 px-3 py-2 text-sm font-semibold"
                  >
                    {product.is_active ? "ปิดขาย" : "เปิดขาย"}
                  </button>
                  <button
                    onClick={() => updateProduct(product, { stock: Math.max(0, product.stock - 1) })}
                    className="rounded-md border border-stone-200 px-3 py-2 text-sm font-semibold"
                  >
                    ลดสต็อก
                  </button>
                  <button
                    onClick={() => updateProduct(product, { is_active: false })}
                    className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={15} />
                    ซ่อน
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
        {products.length === 0 && (
          <div className="rounded-lg border border-stone-200 bg-white p-6 text-sm text-stone-500">
            ยังไม่มีสินค้าในฐานข้อมูล
          </div>
        )}
      </div>
    </section>
  );
}
