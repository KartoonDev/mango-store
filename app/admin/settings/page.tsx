"use client";

import { FormSkeleton } from "@/components/Skeleton";
import { defaultStoreSettings, storeSettingFields, type StoreSettings } from "@/lib/site-config";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { Save, Store } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>(defaultStoreSettings);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      if (!supabase) {
        setIsLoading(false);
        return;
      }

      const { data } = await supabase.from("store_settings").select("*").eq("id", "default").single();
      if (data) {
        setSettings({ ...defaultStoreSettings, ...(data as StoreSettings) });
      }
      setIsLoading(false);
    }

    loadSettings();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!supabase) {
      setMessage("กรุณาตั้งค่า Supabase ก่อนบันทึกการตั้งค่าร้าน");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const nextSettings: StoreSettings = {
      accept_orders: formData.get("accept_orders") === "on",
      announcement: String(formData.get("announcement") || ""),
      pickup_note: String(formData.get("pickup_note") || ""),
      contact_phone: String(formData.get("contact_phone") || ""),
      contact_line: String(formData.get("contact_line") || ""),
      contact_facebook: String(formData.get("contact_facebook") || ""),
      bank_account_name: String(formData.get("bank_account_name") || ""),
      bank_account_number: String(formData.get("bank_account_number") || ""),
      bank_name: String(formData.get("bank_name") || ""),
      qr_image_url: String(formData.get("qr_image_url") || "")
    };

    const payload = {
      id: "default",
      ...nextSettings
    };

    setIsSaving(true);
    const { error } = await supabase.from("store_settings").upsert(payload, { onConflict: "id" });
    setIsSaving(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setSettings(nextSettings);
    setMessage("บันทึกการตั้งค่าร้านแล้ว");
  }

  return (
    isLoading ? (
      <FormSkeleton />
    ) : (
    <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div>
        <p className="text-sm font-semibold text-grove">ตั้งค่าร้าน</p>
        <h2 className="flex items-center gap-2 text-2xl font-bold text-stone-950">
          <Store size={22} />
          ข้อมูลการขายและช่องทางติดต่อ
        </h2>
      </div>

      {!isSupabaseConfigured && (
        <p className="mt-4 rounded-md bg-cream p-3 text-sm text-bark">โหมดเดโม: ต้องตั้งค่า Supabase ก่อนบันทึกจริง</p>
      )}

      <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
        <label className="flex items-center gap-3 rounded-md border border-stone-200 bg-[#fffaf0] p-4">
          <input name="accept_orders" type="checkbox" defaultChecked={settings.accept_orders} />
          <span>
            <span className="block font-semibold text-stone-950">เปิดรับออเดอร์</span>
            <span className="block text-sm text-stone-500">ปิดเมื่อต้องการหยุดรับคำสั่งซื้อชั่วคราว</span>
          </span>
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          {storeSettingFields.map((field) => (
            <label key={field.key} className={field.type === "textarea" ? "grid gap-1 md:col-span-2" : "grid gap-1"}>
              <span className="label">{field.label}</span>
              {field.type === "textarea" ? (
                <textarea name={field.key} defaultValue={String(settings[field.key] || "")} rows={3} className="field" />
              ) : (
                <input
                  name={field.key}
                  type={field.type === "url" ? "url" : "text"}
                  defaultValue={String(settings[field.key] || "")}
                  className="field"
                />
              )}
            </label>
          ))}
        </div>

        <button
          disabled={isSaving}
          className="inline-flex h-11 w-fit items-center justify-center gap-2 rounded-md bg-leaf px-4 font-semibold text-white disabled:opacity-60"
        >
          <Save size={17} />
          {isSaving ? "กำลังบันทึก..." : "บันทึกการตั้งค่า"}
        </button>
        {message && <p className="rounded-md bg-stone-100 p-3 text-sm text-stone-700">{message}</p>}
      </form>
    </section>
    )
  );
}
