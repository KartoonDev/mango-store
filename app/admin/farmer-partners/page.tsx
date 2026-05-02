"use client";

import { supabase } from "@/lib/supabase";
import type { FarmerPartner, FarmerPartnerStatus } from "@/lib/types";
import { ExternalLink, Save } from "lucide-react";
import { useEffect, useState } from "react";

const statusOptions: { value: FarmerPartnerStatus; label: string }[] = [
  { value: "new", label: "เข้าใหม่" },
  { value: "contacted", label: "ติดต่อแล้ว" },
  { value: "qualified", label: "ผ่านคัดเลือก" },
  { value: "paused", label: "พักไว้ก่อน" },
  { value: "rejected", label: "ไม่รับรอบนี้" }
];

export default function AdminFarmerPartnersPage() {
  const [partners, setPartners] = useState<FarmerPartner[]>([]);
  const [message, setMessage] = useState("");

  async function loadPartners() {
    if (!supabase) return;
    const { data } = await supabase.from("farmer_partners").select("*").order("created_at", { ascending: false });
    setPartners((data || []) as FarmerPartner[]);
  }

  useEffect(() => {
    loadPartners();
  }, []);

  async function updatePartner(partner: FarmerPartner, patch: Partial<FarmerPartner>) {
    if (!supabase) return;
    const { error } = await supabase.from("farmer_partners").update(patch).eq("id", partner.id);
    setMessage(error ? error.message : "บันทึกข้อมูลคู่ค้าแล้ว");
    loadPartners();
  }

  return (
    <section className="space-y-4">
      <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-stone-950">คู่ค้าชาวสวน</h2>
        <p className="mt-1 text-sm text-stone-500">ติดตามใบสมัครจากหน้าเว็บและบันทึกสถานะการติดต่อ</p>
      </div>

      {message && <p className="rounded-md bg-stone-100 p-3 text-sm text-stone-700">{message}</p>}

      {partners.map((partner) => (
        <article key={partner.id} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
            <div>
              <p className="text-xs font-semibold uppercase text-stone-400">
                {new Date(partner.created_at).toLocaleString("th-TH")}
              </p>
              <h3 className="mt-1 text-xl font-bold text-stone-950">{partner.farm_name}</h3>
              <p className="text-sm text-stone-600">
                {partner.contact_name} · {partner.phone}
                {partner.line_id ? ` · Line: ${partner.line_id}` : ""}
              </p>
              <p className="mt-2 text-sm text-stone-600">
                {partner.province}
                {partner.district ? ` / ${partner.district}` : ""} · {partner.varieties}
              </p>
              <p className="mt-1 text-sm text-stone-600">
                ปริมาณ {partner.volume_kg ? `${Number(partner.volume_kg).toLocaleString("th-TH")} กก.` : "ยังไม่ระบุ"} · เก็บเกี่ยว{" "}
                {partner.harvest_window}
              </p>
              <p className="mt-2 inline-flex rounded-full bg-grove/15 px-3 py-1 text-xs font-bold text-leaf">
                {partner.has_gap ? "มี GAP / ใบรับรอง" : "ยังไม่มี GAP"}
              </p>
              {partner.certification_note && <p className="mt-3 text-sm text-stone-600">{partner.certification_note}</p>}
              {partner.note && <p className="mt-2 text-sm text-stone-500">หมายเหตุจากชาวสวน: {partner.note}</p>}
              {partner.photo_url && (
                <a href={partner.photo_url} target="_blank" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-leaf">
                  <ExternalLink size={15} />
                  เปิดรูปสวน / ผลผลิต
                </a>
              )}
            </div>

            <div className="space-y-3">
              <label className="grid gap-1">
                <span className="label">สถานะ</span>
                <select
                  value={partner.status}
                  onChange={(event) => updatePartner(partner, { status: event.target.value as FarmerPartnerStatus })}
                  className="field"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1">
                <span className="label">โน้ตแอดมิน</span>
                <textarea
                  defaultValue={partner.admin_note || ""}
                  onBlur={(event) => updatePartner(partner, { admin_note: event.target.value })}
                  className="field min-h-28"
                  placeholder="เช่น โทรแล้ว รอรูปล็อตผลผลิต"
                />
              </label>
              <button
                onClick={() => loadPartners()}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-stone-200 text-sm font-semibold"
              >
                <Save size={15} />
                รีเฟรชข้อมูล
              </button>
            </div>
          </div>
        </article>
      ))}

      {partners.length === 0 && (
        <div className="rounded-lg border border-stone-200 bg-white p-6 text-sm text-stone-500">
          ยังไม่มีใบสมัครคู่ค้าชาวสวน
        </div>
      )}
    </section>
  );
}
