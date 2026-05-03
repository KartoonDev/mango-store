"use client";

import { TableSkeleton } from "@/components/Skeleton";
import { orderStatusLabels, orderStatusOptions } from "@/lib/status";
import { supabase } from "@/lib/supabase";
import type { Order, OrderItem, OrderStatus } from "@/lib/types";
import { ExternalLink, FileImage, PackageOpen } from "lucide-react";
import { useEffect, useState } from "react";

type AdminOrder = Order & {
  order_items?: OrderItem[];
};

const statusBadgeClasses: Record<OrderStatus, string> = {
  pending_payment_review: "bg-amber-100 text-amber-800",
  paid: "bg-blue-100 text-blue-800",
  preparing: "bg-purple-100 text-purple-800",
  ready: "bg-grove/15 text-leaf",
  completed: "bg-leaf text-white",
  cancelled: "bg-stone-100 text-stone-500"
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  async function loadOrders() {
    if (!supabase) {
      setIsLoading(false);
      return;
    }
    const { data } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });
    setOrders((data || []) as AdminOrder[]);
    setIsLoading(false);
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
    <section className="space-y-5">
      <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-bold text-stone-950">ออเดอร์</h2>
        <p className="mt-1 text-sm text-stone-500">
          ตรวจรายการสั่งซื้อ เปลี่ยนสถานะ และเปิดดูสลิปโอนเงินจากลูกค้า
        </p>
      </div>

      {message && <p className="rounded-md bg-white p-3 text-sm text-stone-700 shadow-sm">{message}</p>}

      {isLoading ? (
        <TableSkeleton columns={7} rows={5} minWidth="min-w-[1120px]" />
      ) : (
      <div className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px] text-left text-sm">
            <thead className="bg-cream text-stone-800">
              <tr>
                <th className="px-4 py-3 font-bold">ออเดอร์</th>
                <th className="px-4 py-3 font-bold">ลูกค้า</th>
                <th className="px-4 py-3 font-bold">สินค้า</th>
                <th className="px-4 py-3 font-bold">รับสินค้า</th>
                <th className="px-4 py-3 text-right font-bold">ยอดรวม</th>
                <th className="px-4 py-3 font-bold">สลิป</th>
                <th className="px-4 py-3 font-bold">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {orders.map((order) => (
                <tr key={order.id} className="align-top">
                  <td className="px-4 py-4">
                    <p className="font-bold text-stone-950">
                      {new Date(order.created_at).toLocaleDateString("th-TH", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      })}
                    </p>
                    <p className="mt-1 max-w-[150px] truncate font-mono text-xs text-stone-400">{order.id}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-bold text-stone-950">{order.customer_name}</p>
                    <p className="mt-1 text-stone-600">{order.customer_phone}</p>
                    {order.note && <p className="mt-2 max-w-[220px] text-xs text-stone-500">หมายเหตุ: {order.note}</p>}
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-2">
                      {(order.order_items || []).map((item) => (
                        <div key={item.id} className="rounded-md bg-stone-50 px-3 py-2">
                          <p className="font-semibold text-stone-800">{item.product_name}</p>
                          <p className="text-xs text-stone-500">
                            {item.quantity} x ฿{Number(item.unit_price).toLocaleString("th-TH")} = ฿
                            {Number(item.line_total).toLocaleString("th-TH")}
                          </p>
                        </div>
                      ))}
                      {(order.order_items || []).length === 0 && (
                        <p className="inline-flex items-center gap-2 text-xs text-stone-400">
                          <PackageOpen size={14} />
                          ไม่มีรายการสินค้า
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-stone-800">{order.pickup_method === "pickup" ? "รับเอง" : "นัดส่ง"}</p>
                    <p className="mt-1 text-stone-600">{order.pickup_date}</p>
                    {order.delivery_address && (
                      <p className="mt-2 max-w-[240px] text-xs text-stone-500">{order.delivery_address}</p>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right text-lg font-bold text-leaf">
                    ฿{Number(order.total_amount).toLocaleString("th-TH")}
                  </td>
                  <td className="px-4 py-4">
                    {order.slip_url ? (
                      <a
                        href={order.slip_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-9 items-center gap-2 rounded-md border border-leaf px-3 font-semibold text-leaf hover:bg-grove/10"
                      >
                        <FileImage size={15} />
                        ดูสลิป
                        <ExternalLink size={13} />
                      </a>
                    ) : (
                      <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-500">
                        ไม่มีไฟล์แนบ
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-2">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${statusBadgeClasses[order.status]}`}>
                        {orderStatusLabels[order.status]}
                      </span>
                      <select
                        value={order.status}
                        onChange={(event) => updateStatus(order.id, event.target.value as OrderStatus)}
                        className="field min-w-[190px]"
                      >
                        {orderStatusOptions.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="p-6 text-sm text-stone-500">
              ยังไม่มีออเดอร์
            </div>
          )}
        </div>
      </div>
      )}
    </section>
  );
}
