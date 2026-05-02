"use client";

import { defaultStoreSettings, type StoreSettings } from "@/lib/site-config";
import { supabase } from "@/lib/supabase";
import { Banknote, Facebook, Phone, Send } from "lucide-react";
import { useEffect, useState } from "react";

export default function ContactPage() {
  const [settings, setSettings] = useState<StoreSettings>(defaultStoreSettings);

  useEffect(() => {
    async function loadSettings() {
      if (!supabase) return;
      const { data } = await supabase.from("store_settings").select("*").eq("id", "default").single();
      if (data) {
        setSettings({ ...defaultStoreSettings, ...(data as StoreSettings) });
      }
    }

    loadSettings();
  }, []);

  return (
    <main className="bg-[#fffdf6]">
      <section className="bg-leaf px-4 py-14 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold text-cream">Contact Us</p>
          <h1 className="mt-2 text-4xl font-black md:text-5xl">ติดต่อสวนมะม่วงน้ำดอกไม้</h1>
          <p className="mt-3 max-w-2xl leading-7 text-white/82">
            สอบถามสินค้า รอบตัด การจัดส่ง หรือสมัครคู่ค้าส่งออก ทีมงานจะติดต่อกลับตามช่องทางที่สะดวก
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-12 md:grid-cols-3">
        <article className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <Phone className="text-leaf" size={26} />
          <h2 className="mt-4 text-xl font-bold text-stone-950">โทรศัพท์</h2>
          <p className="mt-2 text-stone-600">{settings.contact_phone || "เพิ่มเบอร์โทรในหลังบ้าน"}</p>
        </article>
        <article className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <Send className="text-leaf" size={26} />
          <h2 className="mt-4 text-xl font-bold text-stone-950">Line</h2>
          <p className="mt-2 text-stone-600">{settings.contact_line || "เพิ่ม Line ในหลังบ้าน"}</p>
        </article>
        <article className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <Facebook className="text-leaf" size={26} />
          <h2 className="mt-4 text-xl font-bold text-stone-950">Facebook</h2>
          <p className="mt-2 break-words text-stone-600">{settings.contact_facebook || "เพิ่ม Facebook URL ในหลังบ้าน"}</p>
        </article>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12">
        <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-md bg-cream text-leaf">
              <Banknote size={22} />
            </span>
            <div>
              <h2 className="text-xl font-bold text-stone-950">ข้อมูลการโอนเงิน</h2>
              <p className="text-sm text-stone-500">ใช้สำหรับออเดอร์ที่แนบสลิปผ่านหน้า checkout</p>
            </div>
          </div>
          <div className="mt-5 grid gap-2 text-stone-700 sm:grid-cols-3">
            <p>{settings.bank_name || "โอนเงินและแนบสลิป"}</p>
            <p>{settings.bank_account_name || "เพิ่มชื่อบัญชีในหลังบ้าน"}</p>
            <p>{settings.bank_account_number || "เพิ่มเลขบัญชีในหลังบ้าน"}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
