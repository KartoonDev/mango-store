"use client";

import { TableSkeleton } from "@/components/Skeleton";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { ExportPrice, ExportPriceStatus } from "@/lib/types";
import { CalendarDays, Eye, EyeOff, Plus, Save, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

const statusOptions: { value: ExportPriceStatus; label: string }[] = [
  { value: "open", label: "เปิดรับซื้อ" },
  { value: "pending", label: "รอราคาใหม่" },
  { value: "closed", label: "ปิดรับชั่วคราว" }
];

const statusBadgeClasses: Record<ExportPriceStatus, string> = {
  open: "bg-grove/15 text-leaf",
  pending: "bg-amber-100 text-amber-800",
  closed: "bg-stone-100 text-stone-500"
};

export default function AdminExportPricesPage() {
  const [prices, setPrices] = useState<ExportPrice[]>([]);
  const [message, setMessage] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  async function loadPrices() {
    if (!supabase) {
      setIsLoading(false);
      return;
    }
    const { data } = await supabase
      .from("export_prices")
      .select("*")
      .order("effective_date", { ascending: false })
      .order("created_at", { ascending: false });
    setPrices((data || []) as ExportPrice[]);
    setIsLoading(false);
  }

  useEffect(() => {
    loadPrices();
  }, []);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    if (!supabase) {
      setMessage("กรุณาตั้งค่า Supabase ก่อนบันทึกราคาส่งออก");
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const { error } = await supabase.from("export_prices").insert({
      variety: String(formData.get("variety")),
      grade: String(formData.get("grade")),
      size_label: String(formData.get("size_label")),
      destination: String(formData.get("destination")),
      price_min: Number(formData.get("price_min")),
      price_max: Number(formData.get("price_max")),
      unit: String(formData.get("unit") || "กก."),
      status: String(formData.get("status")) as ExportPriceStatus,
      effective_date: String(formData.get("effective_date")),
      note: String(formData.get("note") || ""),
      is_active: formData.get("is_active") === "on"
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    form.reset();
    setMessage("เพิ่มราคาส่งออกแล้ว");
    setIsFormOpen(false);
    loadPrices();
  }

  async function updatePrice(price: ExportPrice, patch: Partial<ExportPrice>) {
    if (!supabase) return;
    const { error } = await supabase.from("export_prices").update(patch).eq("id", price.id);
    setMessage(error ? error.message : "บันทึกราคาส่งออกแล้ว");
    loadPrices();
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-col justify-between gap-3 rounded-lg border border-stone-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-stone-950">ราคาส่งออก</h2>
          <p className="mt-1 text-sm text-stone-500">จัดการราคาที่ชาวสวนเห็นบนหน้าเว็บ แยกตามพันธุ์ เกรด ขนาด และปลายทาง</p>
        </div>
        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-leaf px-4 font-semibold text-white hover:bg-bark"
        >
          <Plus size={18} />
          Add
        </button>
      </div>

      {message && <p className="rounded-md bg-white p-3 text-sm text-stone-700 shadow-sm">{message}</p>}
      {!isSupabaseConfigured && (
        <p className="rounded-md bg-cream p-3 text-sm text-bark">ต้องตั้งค่า Supabase ก่อนบันทึกจริง</p>
      )}

      {isLoading ? (
        <TableSkeleton columns={7} rows={5} minWidth="min-w-[1060px]" />
      ) : (
      <div className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1060px] text-left text-sm">
            <thead className="bg-cream text-stone-800">
              <tr>
                <th className="px-4 py-3 font-bold">พันธุ์ / สเปก</th>
                <th className="px-4 py-3 font-bold">ปลายทาง</th>
                <th className="px-4 py-3 text-right font-bold">ราคา</th>
                <th className="px-4 py-3 font-bold">วันที่มีผล</th>
                <th className="px-4 py-3 font-bold">หมายเหตุ</th>
                <th className="px-4 py-3 font-bold">สถานะรับซื้อ</th>
                <th className="px-4 py-3 text-right font-bold">หน้าเว็บ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {prices.map((price) => (
                <tr key={price.id} className="align-top">
                  <td className="px-4 py-4">
                    <p className="font-bold text-stone-950">{price.variety}</p>
                    <p className="mt-1 text-xs text-stone-500">{price.grade}</p>
                    <p className="text-xs text-stone-500">{price.size_label}</p>
                  </td>
                  <td className="px-4 py-4 font-semibold text-stone-700">{price.destination}</td>
                  <td className="px-4 py-4 text-right">
                    <p className="text-lg font-black text-leaf">
                      ฿{Number(price.price_min).toLocaleString("th-TH")}-฿{Number(price.price_max).toLocaleString("th-TH")}
                    </p>
                    <p className="text-xs text-stone-500">/ {price.unit}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="inline-flex items-center gap-2 text-stone-700">
                      <CalendarDays size={14} />
                      {new Date(price.effective_date).toLocaleDateString("th-TH")}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="max-w-[220px] text-xs text-stone-500">{price.note || "-"}</p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-2">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${statusBadgeClasses[price.status]}`}>
                        {statusOptions.find((option) => option.value === price.status)?.label || price.status}
                      </span>
                      <select
                        value={price.status}
                        onChange={(event) => updatePrice(price, { status: event.target.value as ExportPriceStatus })}
                        className="field min-w-[170px]"
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => updatePrice(price, { is_active: !price.is_active })}
                      className={`inline-flex h-9 items-center gap-2 rounded-md px-3 font-semibold ${
                        price.is_active
                          ? "border border-leaf text-leaf hover:bg-grove/10"
                          : "border border-stone-200 text-stone-500 hover:bg-stone-100"
                      }`}
                    >
                      {price.is_active ? <Eye size={15} /> : <EyeOff size={15} />}
                      {price.is_active ? "แสดงอยู่" : "ซ่อนอยู่"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {prices.length === 0 && (
            <div className="p-6 text-sm text-stone-500">
              ยังไม่มีราคาส่งออกในฐานข้อมูล
            </div>
          )}
        </div>
      </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-stone-950/45 px-4 py-6">
          <form
            onSubmit={handleCreate}
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-stone-200 bg-white p-5 shadow-xl"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-xl font-bold text-stone-950">
                <Plus size={20} />
                เพิ่มราคาส่งออก
              </h2>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-md border border-stone-200 text-stone-600 hover:bg-stone-100"
                title="ปิด"
              >
                <X size={17} />
              </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="grid gap-1">
                <span className="label">พันธุ์</span>
                <input name="variety" required className="field" placeholder="น้ำดอกไม้สีทอง" />
              </label>
              <label className="grid gap-1">
                <span className="label">เกรด</span>
                <input name="grade" required className="field" placeholder="เกรด A ส่งออก" />
              </label>
              <label className="grid gap-1">
                <span className="label">ขนาด</span>
                <input name="size_label" required className="field" placeholder="280-420 กรัม/ผล" />
              </label>
              <label className="grid gap-1">
                <span className="label">ปลายทาง</span>
                <input name="destination" required className="field" placeholder="จีน / ฮ่องกง" />
              </label>
              <label className="grid gap-1">
                <span className="label">ราคาต่ำสุด</span>
                <input name="price_min" type="number" min="0" step="0.01" required className="field" />
              </label>
              <label className="grid gap-1">
                <span className="label">ราคาสูงสุด</span>
                <input name="price_max" type="number" min="0" step="0.01" required className="field" />
              </label>
              <label className="grid gap-1">
                <span className="label">หน่วย</span>
                <input name="unit" required defaultValue="กก." className="field" />
              </label>
              <label className="grid gap-1">
                <span className="label">สถานะ</span>
                <select name="status" defaultValue="open" className="field">
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1">
                <span className="label">วันที่มีผล</span>
                <input name="effective_date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} className="field" />
              </label>
              <label className="flex items-center gap-2 rounded-md border border-stone-200 p-3 text-sm font-semibold text-stone-700">
                <input name="is_active" type="checkbox" defaultChecked />
                แสดงบนหน้าเว็บ
              </label>
              <label className="grid gap-1 md:col-span-2">
                <span className="label">หมายเหตุ</span>
                <textarea name="note" className="field min-h-20" />
              </label>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-stone-200 px-4 font-semibold text-stone-700"
              >
                <X size={17} />
                ยกเลิก
              </button>
              <button className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-leaf px-5 font-semibold text-white">
                <Save size={17} />
                บันทึกราคา
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
