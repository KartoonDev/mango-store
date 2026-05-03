"use client";

import { AdminNav } from "@/components/AdminNav";
import { Skeleton } from "@/components/Skeleton";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { LogOut, Sprout, UserCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const [isAllowed, setIsAllowed] = useState(!isSupabaseConfigured);
  const [isChecking, setIsChecking] = useState(isSupabaseConfigured && !isLoginPage);
  const [email, setEmail] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function checkAdmin() {
      setMessage("");
      setEmail(null);

      if (isLoginPage) {
        setIsChecking(false);
        setIsAllowed(false);
        return;
      }

      if (!supabase) {
        setIsChecking(false);
        setIsAllowed(true);
        return;
      }

      setIsChecking(true);
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        setMessage(`ตรวจสอบ session ไม่สำเร็จ: ${sessionError.message}`);
        setIsAllowed(false);
        setIsChecking(false);
        return;
      }

      const user = sessionData.session?.user;
      if (!user) {
        setMessage("ยังไม่ได้เข้าสู่ระบบ กรุณา login ก่อน");
        setIsAllowed(false);
        setIsChecking(false);
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
        setIsChecking(false);
        return;
      }

      if (!profile || !["owner", "staff"].includes(profile.role)) {
        await supabase.auth.signOut();
        setMessage("บัญชีนี้ยังไม่มีสิทธิ์ผู้ดูแล");
        setIsAllowed(false);
        setIsChecking(false);
        return;
      }

      setEmail(user.email || null);
      setIsAllowed(true);
      setIsChecking(false);
    }

    checkAdmin();
  }, [isLoginPage]);

  async function signOut() {
    await supabase?.auth.signOut();
    window.location.href = "/admin/login";
  }

  if (isLoginPage) {
    return <main className="min-h-screen bg-[#fffaf0] px-4 py-10">{children}</main>;
  }

  if (isChecking || !isAllowed) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#fffaf0] px-4 py-10">
        <div className="w-full max-w-md rounded-lg border border-stone-200 bg-white p-6 text-sm text-stone-600 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-md bg-cream text-leaf">
              <Sprout size={22} />
            </span>
            <div>
              <p className="font-bold text-stone-950">หลังบ้านสวนมะม่วง</p>
              {isChecking ? <Skeleton className="mt-2 h-4 w-48" /> : <p className="text-stone-500">{message}</p>}
            </div>
          </div>
          {!isChecking && (
            <Link
              href="/admin/login"
              className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-md bg-leaf px-4 font-semibold text-white"
            >
              ไปหน้า login
            </Link>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffaf0] lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="bg-leaf px-4 py-5 text-white lg:sticky lg:top-0 lg:h-screen">
        <div className="flex items-center gap-3 rounded-lg bg-white/10 p-3">
          <span className="grid h-11 w-11 place-items-center rounded-md bg-cream text-leaf">
            <Sprout size={22} />
          </span>
          <div>
            <p className="text-sm text-white/70">หลังบ้านสวนมะม่วง</p>
            <h1 className="text-lg font-bold">Mango Store</h1>
          </div>
        </div>
        <div className="mt-5">
          <AdminNav />
        </div>
        <Link
          href="/"
          className="mt-6 inline-flex h-10 w-full items-center justify-center rounded-md border border-white/20 text-sm font-semibold text-white hover:bg-white/10"
        >
          กลับหน้าร้าน
        </Link>
      </aside>

      <section className="min-w-0 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {email && (
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm shadow-sm">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-cream text-leaf">
                  <UserCircle size={19} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-stone-400">Admin</p>
                  <p className="truncate font-bold text-stone-800">{email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={signOut}
                className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-200 px-3 font-semibold text-stone-700 hover:bg-stone-100"
              >
                <LogOut size={15} />
                ออกจากระบบ
              </button>
            </div>
          )}
          {children}
        </div>
      </section>
    </main>
  );
}
