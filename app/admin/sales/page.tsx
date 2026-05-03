"use client";

import { StatCardsSkeleton, TableSkeleton } from "@/components/Skeleton";
import { orderStatusLabels } from "@/lib/status";
import { supabase } from "@/lib/supabase";
import type { Order, OrderStatus } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";

const statusBadgeClasses: Record<OrderStatus, string> = {
  pending_payment_review: "bg-amber-100 text-amber-800",
  paid: "bg-blue-100 text-blue-800",
  preparing: "bg-purple-100 text-purple-800",
  ready: "bg-grove/15 text-leaf",
  completed: "bg-leaf text-white",
  cancelled: "bg-stone-100 text-stone-500"
};

export default function AdminSalesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      if (!supabase) {
        setIsLoading(false);
        return;
      }
      const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      setOrders((data || []) as Order[]);
      setIsLoading(false);
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
      {isLoading ? (
        <StatCardsSkeleton />
      ) : (
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
      )}
      <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-stone-950">รายการยอดขาย</h2>
        {isLoading ? (
          <div className="mt-4">
            <TableSkeleton columns={4} rows={5} minWidth="min-w-[640px]" />
          </div>
        ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-cream text-stone-800">
              <tr>
                <th className="px-4 py-3 font-bold">วันที่</th>
                <th className="px-4 py-3 font-bold">ลูกค้า</th>
                <th className="px-4 py-3 font-bold">สถานะ</th>
                <th className="px-4 py-3 text-right font-bold">ยอดรวม</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-3">{new Date(order.created_at).toLocaleDateString("th-TH")}</td>
                  <td className="px-4 py-3 font-semibold">{order.customer_name}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${statusBadgeClasses[order.status]}`}>
                      {orderStatusLabels[order.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-bold">฿{Number(order.total_amount).toLocaleString("th-TH")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </section>
  );
}
