"use client";

import { supabase } from "@/lib/supabase";
import type { ExportPrice, ExportPriceStatus } from "@/lib/types";
import { CheckCircle2, ClipboardCheck, Leaf, PackageCheck, Phone, Scale, Send, ShieldCheck, Sprout } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

const fallbackPrices: ExportPrice[] = [
  {
    id: "sample-1",
    variety: "น้ำดอกไม้สีทอง",
    grade: "เกรด A ส่งออก",
    size_label: "280-420 กรัม/ผล",
    destination: "จีน / ฮ่องกง",
    price_min: 42,
    price_max: 58,
    unit: "กก.",
    status: "open",
    effective_date: new Date().toISOString().slice(0, 10),
    note: "ผลผิวสวย ไม่มีช้ำ คัดแก่จัดตามรอบตัด",
    is_active: true
  },
  {
    id: "sample-2",
    variety: "น้ำดอกไม้เบอร์ 4",
    grade: "เกรด B",
    size_label: "250-450 กรัม/ผล",
    destination: "มาเลเซีย / สิงคโปร์",
    price_min: 30,
    price_max: 42,
    unit: "กก.",
    status: "open",
    effective_date: new Date().toISOString().slice(0, 10),
    note: "รับเฉพาะผลแก่ สีสม่ำเสมอ เหมาะคัดกล่อง",
    is_active: true
  },
  {
    id: "sample-3",
    variety: "มะม่วงมัน / เขียวเสวย",
    grade: "คัดไซซ์",
    size_label: "ตามล็อต",
    destination: "ตลาดรวมส่งออก",
    price_min: 18,
    price_max: 28,
    unit: "กก.",
    status: "pending",
    effective_date: new Date().toISOString().slice(0, 10),
    note: "รอยืนยันรอบรับซื้อถัดไป",
    is_active: true
  }
];

const statusStyles: Record<ExportPriceStatus, string> = {
  open: "bg-leaf text-white",
  pending: "bg-cream text-stone-800",
  closed: "bg-stone-200 text-stone-600"
};

const statusLabels: Record<ExportPriceStatus, string> = {
  open: "เปิดรับซื้อ",
  pending: "รอราคาใหม่",
  closed: "ปิดรับชั่วคราว"
};

export default function ExportPage() {
  const [prices, setPrices] = useState<ExportPrice[]>(fallbackPrices);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const latestDate = useMemo(() => {
    const date = prices[0]?.effective_date;
    return date ? new Date(date).toLocaleDateString("th-TH", { dateStyle: "medium" }) : "วันนี้";
  }, [prices]);

  useEffect(() => {
    async function loadPrices() {
      if (!supabase) return;
      const { data, error } = await supabase
        .from("export_prices")
        .select("*")
        .eq("is_active", true)
        .order("effective_date", { ascending: false })
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        setPrices(data as ExportPrice[]);
      }
    }

    loadPrices();
  }, []);

  async function handlePartnerSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!supabase) {
      setMessage("ยังไม่ได้เชื่อม Supabase กรุณาตั้งค่า environment ก่อนรับสมัครคู่ค้า");
      return;
    }

    setSubmitting(true);
    const form = event.currentTarget;
    const formData = new FormData(form);
    let photoUrl = String(formData.get("photo_url") || "");
    const photoFile = formData.get("photo_file");

    if (photoFile instanceof File && photoFile.size > 0) {
      const fileExt = photoFile.name.split(".").pop() || "jpg";
      const filePath = `${Date.now()}-${Math.random().toString(16).slice(2)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("farmer-photos").upload(filePath, photoFile);

      if (uploadError) {
        setSubmitting(false);
        setMessage(uploadError.message);
        return;
      }

      const { data } = supabase.storage.from("farmer-photos").getPublicUrl(filePath);
      photoUrl = data.publicUrl;
    }

    const { error } = await supabase.from("farmer_partners").insert({
      farm_name: String(formData.get("farm_name")),
      contact_name: String(formData.get("contact_name")),
      phone: String(formData.get("phone")),
      line_id: String(formData.get("line_id") || ""),
      province: String(formData.get("province")),
      district: String(formData.get("district") || ""),
      varieties: String(formData.get("varieties")),
      volume_kg: Number(formData.get("volume_kg") || 0) || null,
      harvest_window: String(formData.get("harvest_window")),
      has_gap: formData.get("has_gap") === "on",
      certification_note: String(formData.get("certification_note") || ""),
      photo_url: photoUrl,
      note: String(formData.get("note") || ""),
      status: "new"
    });

    setSubmitting(false);
    if (error) {
      setMessage(error.message);
      return;
    }

    form.reset();
    setMessage("ส่งข้อมูลสมัครคู่ค้าแล้ว ทีมงานจะติดต่อกลับเพื่อตรวจรอบผลผลิตและมาตรฐานส่งออก");
  }

  return (
    <main className="min-h-screen bg-[#fffdf6] text-stone-900">
      <section className="bg-leaf text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-[1fr_0.9fr] md:items-center md:py-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-semibold text-cream">
              <TrendingBadge />
              อัปเดตราคาส่งออกล่าสุด {latestDate}
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight md:text-6xl">
              ราคามะม่วงส่งออกสำหรับชาวสวน
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/82">
              ดูราคารับซื้อเบื้องต้นตามพันธุ์ เกรด และปลายทาง พร้อมสมัครเป็นคู่ค้าชาวสวนเพื่อให้ทีมจัดซื้อประเมินผลผลิตจริง
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#prices"
                className="inline-flex h-11 items-center justify-center rounded-md bg-cream px-5 text-sm font-bold text-leaf"
              >
                ดูราคาวันนี้
              </a>
              <a
                href="#partner-form"
                className="inline-flex h-11 items-center justify-center rounded-md border border-white/30 px-5 text-sm font-bold text-white hover:bg-white/10"
              >
                สมัครคู่ค้า
              </a>
            </div>
          </div>

          <div className="grid gap-3 rounded-lg border border-white/15 bg-white/8 p-4">
            {[
              ["รับซื้อแบบคัดเกรด", "ระบุพันธุ์ ไซซ์ และมาตรฐานชัดเจน"],
              ["ติดตามง่าย", "ทีมงานติดต่อกลับตามสถานะใบสมัคร"],
              ["เหมาะกับสวนจริง", "วางแผนรอบตัดและปริมาณได้ล่วงหน้า"]
            ].map(([title, text]) => (
              <div key={title} className="rounded-md bg-white p-4 text-stone-900">
                <p className="font-bold text-leaf">{title}</p>
                <p className="mt-1 text-sm text-stone-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="prices" className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-leaf">Export Price Board</p>
            <h2 className="mt-2 text-3xl font-black text-stone-950">กระดานราคามะม่วงส่งออก</h2>
            <p className="mt-2 max-w-2xl text-stone-600">
              ราคาเป็นราคาอ้างอิงเบื้องต้น ทีมงานจะประเมินผลจริงตามคุณภาพ ปริมาณ และรอบขนส่งอีกครั้ง
            </p>
          </div>
          <a href="#partner-form" className="inline-flex h-11 items-center justify-center rounded-md bg-leaf px-5 font-bold text-white">
            แจ้งผลผลิตของฉัน
          </a>
        </div>

        <div className="mt-7 overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
          <div className="hidden grid-cols-[1.1fr_0.9fr_0.9fr_1fr_0.8fr_0.8fr] bg-[#f2edc2] px-4 py-3 text-sm font-bold text-stone-800 md:grid">
            <span>พันธุ์ / เกรด</span>
            <span>ขนาด</span>
            <span>ปลายทาง</span>
            <span>ราคา</span>
            <span>สถานะ</span>
            <span>วันที่</span>
          </div>
          {prices.map((price) => (
            <article
              key={price.id}
              className="grid gap-3 border-t border-stone-100 px-4 py-4 md:grid-cols-[1.1fr_0.9fr_0.9fr_1fr_0.8fr_0.8fr] md:items-center"
            >
              <div>
                <h3 className="font-bold text-stone-950">{price.variety}</h3>
                <p className="text-sm text-stone-500">{price.grade}</p>
                {price.note && <p className="mt-1 text-xs text-stone-500">{price.note}</p>}
              </div>
              <p className="text-sm font-semibold text-stone-700">{price.size_label}</p>
              <p className="text-sm text-stone-600">{price.destination}</p>
              <p className="text-xl font-black text-leaf">
                ฿{Number(price.price_min).toLocaleString("th-TH")}-฿{Number(price.price_max).toLocaleString("th-TH")} / {price.unit}
              </p>
              <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${statusStyles[price.status]}`}>
                {statusLabels[price.status]}
              </span>
              <p className="text-sm text-stone-500">{new Date(price.effective_date).toLocaleDateString("th-TH")}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#f2edc2]/55 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-black text-stone-950">มาตรฐานที่ช่วยให้ขายส่งออกได้ดีขึ้น</h2>
            <p className="mx-auto mt-2 max-w-2xl text-stone-600">
              ชาวสวนเตรียมข้อมูลเหล่านี้ไว้ก่อนสมัคร จะช่วยให้ทีมประเมินราคาและรอบรับซื้อได้เร็วขึ้น
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {[
              [Scale, "ขนาดและน้ำหนัก", "แยกไซซ์ให้สม่ำเสมอ ลดผลปะปนในล็อตเดียว"],
              [ShieldCheck, "GAP / สารตกค้าง", "มีข้อมูลแหล่งปลูกและการใช้สารชัดเจน"],
              [Leaf, "ความแก่และผิว", "ผลแก่ตามรอบตัด ผิวสวย ไม่มีช้ำหรือโรค"],
              [PackageCheck, "การคัดและแพ็ก", "พร้อมคัดเกรดก่อนส่งเข้าจุดรวบรวม"]
            ].map(([Icon, title, text]) => (
              <article key={String(title)} className="rounded-lg border border-leaf/10 bg-white p-5 shadow-sm">
                <span className="grid h-11 w-11 place-items-center rounded-md bg-[#9fcb98]/35 text-leaf">
                  <Icon size={21} />
                </span>
                <h3 className="mt-4 font-bold text-stone-950">{title as string}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{text as string}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="partner-form" className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-leaf">Partner Application</p>
          <h2 className="mt-2 text-3xl font-black text-stone-950">สมัครคู่ค้าชาวสวน</h2>
          <p className="mt-3 leading-7 text-stone-600">
            ส่งข้อมูลสวนและรอบผลผลิตให้ทีมจัดซื้อ เราจะติดต่อกลับเพื่อตรวจคุณภาพ ประเมินราคา และวางแผนรับซื้อรายล็อต
          </p>
          <div className="mt-6 space-y-3">
            {[
              [Phone, "ทีมงานติดต่อกลับตามเบอร์หรือ Line"],
              [ClipboardCheck, "ตรวจข้อมูลพันธุ์ ปริมาณ และช่วงเก็บเกี่ยว"],
              [CheckCircle2, "นัดประเมินคุณภาพก่อนยืนยันราคารับซื้อ"]
            ].map(([Icon, text]) => (
              <p key={String(text)} className="flex items-center gap-3 text-sm font-semibold text-stone-700">
                <span className="grid h-9 w-9 place-items-center rounded-md bg-cream text-leaf">
                  <Icon size={18} />
                </span>
                {text as string}
              </p>
            ))}
          </div>
        </div>

        <form onSubmit={handlePartnerSubmit} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-1">
              <span className="label">ชื่อสวน</span>
              <input name="farm_name" required className="field" placeholder="เช่น สวนลุงสมชาย" />
            </label>
            <label className="grid gap-1">
              <span className="label">ชื่อผู้ติดต่อ</span>
              <input name="contact_name" required className="field" />
            </label>
            <label className="grid gap-1">
              <span className="label">เบอร์โทร</span>
              <input name="phone" required className="field" inputMode="tel" />
            </label>
            <label className="grid gap-1">
              <span className="label">Line ID</span>
              <input name="line_id" className="field" />
            </label>
            <label className="grid gap-1">
              <span className="label">จังหวัด</span>
              <input name="province" required className="field" />
            </label>
            <label className="grid gap-1">
              <span className="label">อำเภอ</span>
              <input name="district" className="field" />
            </label>
            <label className="grid gap-1 md:col-span-2">
              <span className="label">พันธุ์มะม่วงที่มี</span>
              <input name="varieties" required className="field" placeholder="น้ำดอกไม้สีทอง, น้ำดอกไม้เบอร์ 4" />
            </label>
            <label className="grid gap-1">
              <span className="label">ปริมาณโดยประมาณต่อฤดูกาล (กก.)</span>
              <input name="volume_kg" type="number" min="0" className="field" />
            </label>
            <label className="grid gap-1">
              <span className="label">ช่วงเก็บเกี่ยว</span>
              <input name="harvest_window" required className="field" placeholder="เช่น มี.ค.-พ.ค." />
            </label>
            <label className="flex items-center gap-2 rounded-md border border-stone-200 p-3 text-sm font-semibold text-stone-700 md:col-span-2">
              <input name="has_gap" type="checkbox" />
              มี GAP หรือใบรับรองแหล่งผลิต
            </label>
            <label className="grid gap-1 md:col-span-2">
              <span className="label">รายละเอียดใบรับรอง / จุดเด่นของสวน</span>
              <textarea name="certification_note" className="field min-h-20" />
            </label>
            <label className="grid gap-1">
              <span className="label">แนบรูปสวนหรือผลผลิต</span>
              <input name="photo_file" type="file" accept="image/*" className="field" />
            </label>
            <label className="grid gap-1">
              <span className="label">หรือวางลิงก์รูปภาพ</span>
              <input name="photo_url" type="url" className="field" />
            </label>
            <label className="grid gap-1 md:col-span-2">
              <span className="label">หมายเหตุเพิ่มเติม</span>
              <textarea name="note" className="field min-h-24" placeholder="เช่น พร้อมตัดรอบแรกประมาณวันที่..." />
            </label>
          </div>

          <button
            disabled={submitting}
            className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-leaf px-4 font-bold text-white disabled:opacity-60"
          >
            <Send size={17} />
            {submitting ? "กำลังส่งข้อมูล..." : "ส่งใบสมัครคู่ค้า"}
          </button>
          {message && <p className="mt-4 rounded-md bg-stone-100 p-3 text-sm text-stone-700">{message}</p>}
        </form>
      </section>
    </main>
  );
}

function TrendingBadge() {
  return <Sprout size={16} aria-hidden />;
}
