"use client";

import { orderStatusLabels, orderStatusOptions } from "@/lib/status";
import { supabase } from "@/lib/supabase";
import type { Order, OrderStatus } from "@/lib/types";
import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [message, setMessage] = useState("");

  async function loadOrders() {
    if (!supabase) return;
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders((data || []) as Order[]);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function updateStatus(orderId: string, status: OrderStatus) {
    if (!supabase) return;
    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
    setMessage(error ? error.message : "อัปเดตสถานะแล้ว");
    loadOrders();
  }

  return (
    <section className="space-y-4">
      {message && <p className="rounded-md bg-stone-100 p-3 text-sm text-stone-700">{message}</p>}
      {orders.map((order) => (
        <article key={order.id} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <p className="text-xs font-semibold uppercase text-stone-400">{order.id}</p>
              <h2 className="mt-1 text-xl font-bold text-stone-950">{order.customer_name}</h2>
              <p className="text-sm text-stone-600">{order.customer_phone}</p>
              <p className="mt-2 text-sm text-stone-600">
                {order.pickup_method === "pickup" ? "รับเอง" : "นัดส่ง"} · {order.pickup_date}
              </p>
              {order.delivery_address && <p className="mt-1 text-sm text-stone-600">{order.delivery_address}</p>}
            </div>
            <div className="min-w-[220px] space-y-3">
              <p className="text-2xl font-bold text-leaf">฿{Number(order.total_amount).toLocaleString("th-TH")}</p>
              <select
                value={order.status}
                onChange={(event) => updateStatus(order.id, event.target.value as OrderStatus)}
                className="field"
              >
                {orderStatusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
              <p className="text-sm text-stone-500">{orderStatusLabels[order.status]}</p>
              {order.slip_url && (
                <a
                  href={order.slip_url}
                  target="_blank"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-leaf"
                >
                  <ExternalLink size={15} />
                  เปิดสลิป
                </a>
              )}
            </div>
          </div>
        </article>
      ))}
      {orders.length === 0 && (
        <div className="rounded-lg border border-stone-200 bg-white p-6 text-sm text-stone-500">
          ยังไม่มีออเดอร์
        </div>
      )}
    </section>
  );
}
