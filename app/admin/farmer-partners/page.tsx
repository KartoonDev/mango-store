"use client";

import { TableSkeleton } from "@/components/Skeleton";
import { supabase } from "@/lib/supabase";
import type { FarmerPartner, FarmerPartnerStatus } from "@/lib/types";
import { BadgeCheck, ExternalLink, ImageIcon, RefreshCw, Save } from "lucide-react";
import { useEffect, useState } from "react";

const statusOptions: { value: FarmerPartnerStatus; label: string }[] = [
  { value: "new", label: "เข้าใหม่" },
  { value: "contacted", label: "ติดต่อแล้ว" },
  { value: "qualified", label: "ผ่านคัดเลือก" },
  { value: "paused", label: "พักไว้ก่อน" },
  { value: "rejected", label: "ไม่รับรอบนี้" }
];

const statusBadgeClasses: Record<FarmerPartnerStatus, string> = {
  new: "bg-amber-100 text-amber-800",
  contacted: "bg-blue-100 text-blue-800",
  qualified: "bg-grove/15 text-leaf",
  paused: "bg-stone-100 text-stone-600",
  rejected: "bg-red-50 text-red-700"
};

export default function AdminFarmerPartnersPage() {
  const [partners, setPartners] = useState<FarmerPartner[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  async function loadPartners() {
    if (!supabase) {
      setIsLoading(false);
      return;
    }
    const { data } = await supabase.from("farmer_partners").select("*").order("created_at", { ascending: false });
    setPartners((data || []) as FarmerPartner[]);
    setIsLoading(false);
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
    <section className="space-y-5">
      <div className="flex flex-col justify-between gap-3 rounded-lg border border-stone-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-stone-950">คู่ค้าชาวสวน</h2>
          <p className="mt-1 text-sm text-stone-500">ติดตามใบสมัครจากหน้าเว็บ เปรียบเทียบพื้นที่ ผลผลิต GAP และสถานะติดต่อ</p>
        </div>
        <button
          onClick={() => loadPartners()}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-stone-200 px-3 text-sm font-semibold text-stone-700 hover:bg-stone-100"
        >
          <RefreshCw size={15} />
          รีเฟรชข้อมูล
        </button>
      </div>

      {message && <p className="rounded-md bg-white p-3 text-sm text-stone-700 shadow-sm">{message}</p>}

      {isLoading ? (
        <TableSkeleton columns={7} rows={5} minWidth="min-w-[1180px]" />
      ) : (
      <div className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1180px] text-left text-sm">
            <thead className="bg-cream text-stone-800">
              <tr>
                <th className="px-4 py-3 font-bold">วันที่สมัคร</th>
                <th className="px-4 py-3 font-bold">สวน / ติดต่อ</th>
                <th className="px-4 py-3 font-bold">พื้นที่</th>
                <th className="px-4 py-3 font-bold">ผลผลิต</th>
                <th className="px-4 py-3 font-bold">GAP</th>
                <th className="px-4 py-3 font-bold">รูปแนบ</th>
                <th className="px-4 py-3 font-bold">ติดตามงาน</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {partners.map((partner) => (
                <tr key={partner.id} className="align-top">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-stone-800">
                      {new Date(partner.created_at).toLocaleDateString("th-TH", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      })}
                    </p>
                    <p className="mt-1 text-xs text-stone-400">
                      {new Date(partner.created_at).toLocaleTimeString("th-TH", {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-bold text-stone-950">{partner.farm_name}</p>
                    <p className="mt-1 text-stone-600">{partner.contact_name}</p>
                    <p className="text-stone-600">{partner.phone}</p>
                    {partner.line_id && <p className="text-xs text-stone-500">Line: {partner.line_id}</p>}
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-stone-800">{partner.province}</p>
                    {partner.district && <p className="text-xs text-stone-500">{partner.district}</p>}
                  </td>
                  <td className="px-4 py-4">
                    <p className="max-w-[180px] font-semibold text-stone-800">{partner.varieties}</p>
                    <p className="mt-1 text-xs text-stone-500">
                      ปริมาณ {partner.volume_kg ? `${Number(partner.volume_kg).toLocaleString("th-TH")} กก.` : "ยังไม่ระบุ"}
                    </p>
                    <p className="text-xs text-stone-500">เก็บเกี่ยว {partner.harvest_window}</p>
                    {partner.note && <p className="mt-2 max-w-[220px] text-xs text-stone-500">หมายเหตุ: {partner.note}</p>}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${
                      partner.has_gap ? "bg-grove/15 text-leaf" : "bg-stone-100 text-stone-500"
                    }`}>
                      <BadgeCheck size={14} />
                      {partner.has_gap ? "มี GAP" : "ยังไม่มี"}
                    </span>
                    {partner.certification_note && (
                      <p className="mt-2 max-w-[190px] text-xs text-stone-500">{partner.certification_note}</p>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    {partner.photo_url ? (
                      <a
                        href={partner.photo_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-9 items-center gap-2 rounded-md border border-leaf px-3 font-semibold text-leaf hover:bg-grove/10"
                      >
                        <ImageIcon size={15} />
                        เปิดรูป
                        <ExternalLink size={13} />
                      </a>
                    ) : (
                      <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-500">
                        ไม่มีรูป
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-2">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${statusBadgeClasses[partner.status]}`}>
                        {statusOptions.find((option) => option.value === partner.status)?.label || partner.status}
                      </span>
                      <select
                        value={partner.status}
                        onChange={(event) => updatePartner(partner, { status: event.target.value as FarmerPartnerStatus })}
                        className="field min-w-[170px]"
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <label className="grid gap-1">
                        <span className="sr-only">โน้ตแอดมิน</span>
                        <textarea
                          defaultValue={partner.admin_note || ""}
                          onBlur={(event) => updatePartner(partner, { admin_note: event.target.value })}
                          className="field min-h-20 min-w-[220px] text-xs"
                          placeholder="โน้ตติดตาม เช่น โทรแล้ว รอรูปล็อตผลผลิต"
                        />
                      </label>
                      <p className="inline-flex items-center gap-1 text-xs text-stone-400">
                        <Save size={12} />
                        บันทึกโน้ตเมื่อคลิกออกจากช่อง
                      </p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {partners.length === 0 && (
            <div className="p-6 text-sm text-stone-500">
              ยังไม่มีใบสมัครคู่ค้าชาวสวน
            </div>
          )}
        </div>
      </div>
      )}
    </section>
  );
}
