"use client";

import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function AdminGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAllowed, setIsAllowed] = useState(!isSupabaseConfigured || pathname === "/admin/login");
  const [email, setEmail] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function checkAdmin() {
      setMessage("");
      if (!supabase || pathname === "/admin/login") {
        setIsAllowed(true);
        return;
      }

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        setMessage(`ตรวจสอบ session ไม่สำเร็จ: ${sessionError.message}`);
        setIsAllowed(false);
        return;
      }

      const user = sessionData.session?.user;
      if (!user) {
        setMessage("ยังไม่ได้เข้าสู่ระบบ กรุณา login ก่อน");
        setIsAllowed(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileError) {
        setMessage(`อ่านสิทธิ์ผู้ดูแลไม่สำเร็จ: ${profileError.message}`);
        setIsAllowed(false);
        return;
      }

      if (!profile || !["owner", "staff"].includes(profile.role)) {
        await supabase.auth.signOut();
        setMessage("บัญชีนี้ยังไม่มีสิทธิ์ผู้ดูแล");
        setIsAllowed(false);
        return;
      }

      setEmail(user.email || null);
      setIsAllowed(true);
    }

    checkAdmin();
  }, [pathname]);

  async function signOut() {
    await supabase?.auth.signOut();
    window.location.href = "/admin/login";
  }

  if (!isAllowed) {
    return (
      <div className="rounded-lg border border-stone-200 bg-white p-6 text-sm text-stone-600 shadow-sm">
        {message || "กำลังตรวจสอบสิทธิ์ผู้ดูแล..."}
        {message && (
          <Link
            href="/admin/login"
            className="mt-4 inline-flex h-10 items-center rounded-md bg-leaf px-4 font-semibold text-white"
          >
            ไปหน้า login
          </Link>
        )}
      </div>
    );
  }

  return (
    <>
      {message && pathname !== "/admin/login" && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {message}
        </div>
      )}
      {email && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-stone-200 bg-white p-3 text-sm">
          <span className="text-stone-600">เข้าสู่ระบบเป็น {email}</span>
          <button
            type="button"
            onClick={signOut}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-200 px-3 font-semibold hover:bg-stone-100"
          >
            <LogOut size={15} />
            ออกจากระบบ
          </button>
        </div>
      )}
      {children}
    </>
  );
}
