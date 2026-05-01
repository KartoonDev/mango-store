"use client";

import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function AdminGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAllowed, setIsAllowed] = useState(!isSupabaseConfigured || pathname === "/admin/login");
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    async function checkAdmin() {
      if (!supabase || pathname === "/admin/login") {
        setIsAllowed(true);
        return;
      }

      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (!user) {
        window.location.href = "/admin/login";
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!profile || !["owner", "staff"].includes(profile.role)) {
        await supabase.auth.signOut();
        window.location.href = "/admin/login";
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
        กำลังตรวจสอบสิทธิ์ผู้ดูแล...
      </div>
    );
  }

  return (
    <>
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
