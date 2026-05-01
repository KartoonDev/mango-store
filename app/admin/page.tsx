"use client";

import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { Order, Product } from "@/lib/types";
import { Boxes, ClipboardList, CircleDollarSign } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function load() {
      if (!supabase) return;
      const [{ data: productData }, { data: orderData }] = await Promise.all([
        supabase.from("products").select("*"),
        supabase.from("orders").select("*").order("created_at", { ascending: false })
      ]);
      setProducts((productData || []) as Product[]);
      setOrders((orderData || []) as Order[]);
    }

    load();
  }, []);

  const completedSales = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + Number(order.total_amount), 0);

  const cards = [
    { label: "สินค้า", value: products.length, icon: Boxes, href: "/admin/products" },
    { label: "ออเดอร์", value: orders.length, icon: ClipboardList, href: "/admin/orders" },
    { label: "ยอดขาย", value: `฿${completedSales.toLocaleString("th-TH")}`, icon: CircleDollarSign, href: "/admin/sales" }
  ];

  return (
    <section className="space-y-5">
      {!isSupabaseConfigured && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-900">
          ยังไม่ได้ตั้งค่า Supabase หลังบ้านจะแสดงข้อมูลจริงเมื่อเติมค่า `.env.local` และรัน SQL schema แล้ว
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.label} href={card.href} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-stone-500">{card.label}</p>
                <Icon size={20} className="text-leaf" />
              </div>
              <p className="mt-3 text-3xl font-bold text-stone-950">{card.value}</p>
            </Link>
          );
        })}
      </div>
      <div className="rounded-lg border border-stone-200 bg-white p-5">
        <h2 className="text-xl font-bold text-stone-950">ออเดอร์ล่าสุด</h2>
        <div className="mt-4 divide-y divide-stone-100">
          {orders.slice(0, 5).map((order) => (
            <div key={order.id} className="flex items-center justify-between gap-3 py-3 text-sm">
              <div>
                <p className="font-semibold text-stone-950">{order.customer_name}</p>
                <p className="text-stone-500">{new Date(order.created_at).toLocaleString("th-TH")}</p>
              </div>
              <p className="font-bold text-leaf">฿{Number(order.total_amount).toLocaleString("th-TH")}</p>
            </div>
          ))}
          {orders.length === 0 && <p className="py-4 text-sm text-stone-500">ยังไม่มีออเดอร์</p>}
        </div>
      </div>
    </section>
  );
}
