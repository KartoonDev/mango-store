"use client";

import { supabase } from "@/lib/supabase";
import { LogIn } from "lucide-react";
import { FormEvent, useState } from "react";

function getLoginMessage(message: string) {
  if (message.toLowerCase().includes("invalid login credentials")) {
    return "อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจรหัสผ่านใน Supabase Auth หรือ reset password ใหม่";
  }

  if (message.toLowerCase().includes("email not confirmed")) {
    return "บัญชียังไม่ได้ยืนยันอีเมล กรุณาเปิด Auto Confirm User หรือยืนยันอีเมลก่อน";
  }

  return message;
}

export default function AdminLoginPage() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!supabase) {
      setMessage("กรุณาตั้งค่า Supabase env ก่อนใช้งานล็อกอิน");
      return;
    }

    const formData = new FormData(event.currentTarget);
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(formData.get("email")),
      password: String(formData.get("password"))
    });
    setIsLoading(false);

    if (error) {
      setMessage(getLoginMessage(error.message));
      return;
    }

    window.location.href = "/admin";
  }

  return (
    <section className="mx-auto max-w-md rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-stone-950">เข้าสู่ระบบหลังบ้าน</h2>
      <form onSubmit={handleLogin} className="mt-5 grid gap-4">
        <label className="grid gap-1">
          <span className="label">อีเมล</span>
          <input name="email" type="email" required className="field" />
        </label>
        <label className="grid gap-1">
          <span className="label">รหัสผ่าน</span>
          <input name="password" type="password" required className="field" />
        </label>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-leaf px-4 font-semibold text-white disabled:opacity-60"
        >
          <LogIn size={18} />
          {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>
        {message && <p className="rounded-md bg-stone-100 p-3 text-sm text-stone-700">{message}</p>}
      </form>
    </section>
  );
}
