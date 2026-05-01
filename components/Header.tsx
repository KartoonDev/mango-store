"use client";

import { useCart } from "@/components/CartProvider";
import { LayoutDashboard, ShoppingBasket } from "lucide-react";
import Link from "next/link";

export function Header() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-20 border-b border-black/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-leaf text-lg font-bold text-white">
            M
          </span>
          <span>
            <span className="block text-base font-semibold text-stone-950">สวนมะม่วงน้ำดอกไม้</span>
            <span className="block text-xs text-stone-500">Nam Dok Mai Mango Store</span>
          </span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link
            href="/admin"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-stone-200 text-stone-700 transition hover:bg-stone-100"
            title="หลังบ้าน"
          >
            <LayoutDashboard size={18} />
          </Link>
          <Link
            href="/checkout"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-leaf px-3 text-sm font-semibold text-white transition hover:bg-green-800"
          >
            <ShoppingBasket size={18} />
            <span>{totalItems}</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
