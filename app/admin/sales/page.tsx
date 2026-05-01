"use client";

import { supabase } from "@/lib/supabase";
import type { Order } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";

export default function AdminSalesPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function loadOrders() {
      if (!supabase) return;
      const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      setOrders((data || []) as Order[]);
    }

    loadOrders();
  }, []);

  const stats = useMemo(() => {
    const activeOrders = orders.filter((order) => order.status !== "cancelled");
    const completedOrders = orders.filter((order) => order.status === "completed");
    return {
      total: activeOrders.reduce((sum, order) => sum + Number(order.total_amount), 0),
      orders: activeOrders.length,
      completed: completedOrders.length,
      average: activeOrders.length
        ? activeOrders.reduce((sum, order) => sum + Number(order.total_amount), 0) / activeOrders.length
        : 0
    };
  }, [orders]);

  return (
    <section className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          ["ยอดขายรวม", `฿${stats.total.toLocaleString("th-TH")}`],
          ["จำนวนออเดอร์", stats.orders],
          ["สำเร็จแล้ว", stats.completed],
          ["เฉลี่ยต่อออเดอร์", `฿${Math.round(stats.average).toLocaleString("th-TH")}`]
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-stone-500">{label}</p>
            <p className="mt-3 text-2xl font-bold text-stone-950">{value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-stone-950">รายการยอดขาย</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-stone-500">
              <tr>
                <th className="py-2">วันที่</th>
                <th className="py-2">ลูกค้า</th>
                <th className="py-2">สถานะ</th>
                <th className="py-2 text-right">ยอดรวม</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="py-3">{new Date(order.created_at).toLocaleDateString("th-TH")}</td>
                  <td className="py-3 font-semibold">{order.customer_name}</td>
                  <td className="py-3">{order.status}</td>
                  <td className="py-3 text-right font-bold">฿{Number(order.total_amount).toLocaleString("th-TH")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
