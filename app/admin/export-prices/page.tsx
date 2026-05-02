"use client";

import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { ExportPrice, ExportPriceStatus } from "@/lib/types";
import { Plus, Save } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

const statusOptions: { value: ExportPriceStatus; label: string }[] = [
  { value: "open", label: "เปิดรับซื้อ" },
  { value: "pending", label: "รอราคาใหม่" },
  { value: "closed", label: "ปิดรับชั่วคราว" }
];

export default function AdminExportPricesPage() {
  const [prices, setPrices] = useState<ExportPrice[]>([]);
  const [message, setMessage] = useState("");

  async function loadPrices() {
    if (!supabase) return;
    const { data } = await supabase
      .from("export_prices")
      .select("*")
      .order("effective_date", { ascending: false })
      .order("created_at", { ascending: false });
    setPrices((data || []) as ExportPrice[]);
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
    loadPrices();
  }

  async function updatePrice(price: ExportPrice, patch: Partial<ExportPrice>) {
    if (!supabase) return;
    const { error } = await supabase.from("export_prices").update(patch).eq("id", price.id);
    setMessage(error ? error.message : "บันทึกราคาส่งออกแล้ว");
    loadPrices();
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[0.9fr_1.2fr]">
      <form onSubmit={handleCreate} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <h2 className="flex items-center gap-2 text-xl font-bold text-stone-950">
          <Plus size={20} />
          เพิ่มราคาส่งออก
        </h2>
        {!isSupabaseConfigured && <p className="mt-2 text-sm text-stone-500">ต้องตั้งค่า Supabase ก่อนบันทึกจริง</p>}

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

        <button className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-leaf px-4 font-semibold text-white">
          <Save size={17} />
          บันทึกราคา
        </button>
        {message && <p className="mt-4 rounded-md bg-stone-100 p-3 text-sm text-stone-700">{message}</p>}
      </form>

      <div className="space-y-3">
        {prices.map((price) => (
          <article key={price.id} className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
              <div>
                <p className="text-xs font-semibold uppercase text-stone-400">{price.destination}</p>
                <h3 className="mt-1 text-lg font-bold text-stone-950">{price.variety}</h3>
                <p className="text-sm text-stone-600">
                  {price.grade} · {price.size_label}
                </p>
                <p className="mt-2 text-2xl font-black text-leaf">
                  ฿{Number(price.price_min).toLocaleString("th-TH")}-฿{Number(price.price_max).toLocaleString("th-TH")} / {price.unit}
                </p>
                {price.note && <p className="mt-2 text-sm text-stone-500">{price.note}</p>}
              </div>
              <div className="min-w-[220px] space-y-2">
                <select
                  value={price.status}
                  onChange={(event) => updatePrice(price, { status: event.target.value as ExportPriceStatus })}
                  className="field"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => updatePrice(price, { is_active: !price.is_active })}
                  className="h-10 w-full rounded-md border border-stone-200 text-sm font-semibold"
                >
                  {price.is_active ? "ซ่อนจากหน้าเว็บ" : "แสดงบนหน้าเว็บ"}
                </button>
              </div>
            </div>
          </article>
        ))}
        {prices.length === 0 && (
          <div className="rounded-lg border border-stone-200 bg-white p-6 text-sm text-stone-500">
            ยังไม่มีราคาส่งออกในฐานข้อมูล
          </div>
        )}
      </div>
    </section>
  );
}
