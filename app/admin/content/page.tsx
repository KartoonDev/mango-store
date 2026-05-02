"use client";

import { defaultSiteContent, siteContentFields, type SiteContent } from "@/lib/site-config";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { SiteContentRow } from "@/lib/types";
import { Eye, Save } from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

export default function AdminContentPage() {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadContent() {
      if (!supabase) return;

      const { data } = await supabase.from("site_content").select("key,value");
      if (!data?.length) return;

      const nextContent = { ...defaultSiteContent };
      for (const row of data as SiteContentRow[]) {
        if (row.key in nextContent) {
          nextContent[row.key as keyof SiteContent] = row.value;
        }
      }
      setContent(nextContent);
    }

    loadContent();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!supabase) {
      setMessage("กรุณาตั้งค่า Supabase ก่อนบันทึกข้อมูลหน้าเว็บ");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const rows = siteContentFields.map((field) => ({
      key: field.key,
      value: String(formData.get(field.key) || "")
    }));

    setIsSaving(true);
    const { error } = await supabase.from("site_content").upsert(rows, { onConflict: "key" });
    setIsSaving(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setContent(rows.reduce((acc, row) => ({ ...acc, [row.key]: row.value }), defaultSiteContent));
    setMessage("บันทึกหน้าเว็บแล้ว");
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <form onSubmit={handleSubmit} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-grove">จัดการหน้าเว็บ</p>
            <h2 className="text-2xl font-bold text-stone-950">ข้อความและรูปหน้าแรก</h2>
          </div>
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-stone-200 px-3 text-sm font-semibold text-stone-700 hover:bg-stone-100"
          >
            <Eye size={16} />
            ดูหน้าร้าน
          </Link>
        </div>

        {!isSupabaseConfigured && (
          <p className="mt-4 rounded-md bg-cream p-3 text-sm text-bark">
            โหมดเดโม: ต้องตั้งค่า Supabase ก่อนบันทึกจริง
          </p>
        )}

        <div className="mt-5 grid gap-4">
          {siteContentFields.map((field) => (
            <label key={field.key} className="grid gap-1">
              <span className="label">{field.label}</span>
              {field.type === "textarea" ? (
                <textarea name={field.key} defaultValue={content[field.key]} rows={3} className="field" />
              ) : (
                <input
                  name={field.key}
                  type={field.type === "url" ? "url" : "text"}
                  defaultValue={content[field.key]}
                  className="field"
                />
              )}
            </label>
          ))}
        </div>

        <button
          disabled={isSaving}
          className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-leaf px-4 font-semibold text-white disabled:opacity-60"
        >
          <Save size={17} />
          {isSaving ? "กำลังบันทึก..." : "บันทึกหน้าเว็บ"}
        </button>
        {message && <p className="mt-4 rounded-md bg-stone-100 p-3 text-sm text-stone-700">{message}</p>}
      </form>

      <aside className="rounded-lg border border-stone-200 bg-cream p-5">
        <p className="text-sm font-semibold text-bark">ตัวอย่าง Hero</p>
        <div className="mt-4 overflow-hidden rounded-lg bg-leaf text-white">
          <img src={content.hero_image_url} alt="" className="h-44 w-full object-cover opacity-65" />
          <div className="p-4">
            <p className="text-xs font-semibold text-cream">{content.hero_badge}</p>
            <h3 className="mt-2 text-2xl font-bold">{content.hero_title}</h3>
            <p className="mt-2 text-sm text-white/80">{content.hero_subtitle}</p>
          </div>
        </div>
      </aside>
    </section>
  );
}
