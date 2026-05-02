"use client";

import { useCart } from "@/components/CartProvider";
import { LayoutDashboard, ShoppingBasket, User } from "lucide-react";
import Link from "next/link";

export function Header() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-20 border-b border-leaf/10 bg-white/95 backdrop-blur">
      <div className="h-5 bg-cream" />
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 py-2">
        <nav className="hidden items-center gap-7 text-sm font-semibold text-stone-800 md:flex">
          <Link href="/" className="border-b-2 border-cream text-leaf">
            Home
          </Link>
          <a href="#selection">Our Selection</a>
          <a href="#gifting">Gifting</a>
          <a href="#story">Story</a>
          <a href="#contact">Contact</a>
        </nav>

        <Link href="/" className="justify-self-start md:justify-self-center">
          <span className="grid h-20 w-20 place-items-center rounded-full border-4 border-cream bg-white shadow-soft md:h-24 md:w-24">
            <span className="grid h-16 w-16 place-items-center rounded-full border border-leaf/20 bg-[#fbf9e9] text-center text-[10px] font-bold leading-tight text-leaf md:h-20 md:w-20">
              สวนมะม่วง<br />น้ำดอกไม้
            </span>
          </span>
        </Link>

        <nav className="flex items-center justify-end gap-2">
          <Link
            href="/admin"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-stone-200 text-stone-700 transition hover:bg-stone-100"
            title="หลังบ้าน"
          >
            <LayoutDashboard size={18} />
          </Link>
          <span className="hidden h-10 w-10 items-center justify-center rounded-md text-stone-700 sm:inline-flex">
            <User size={18} />
          </span>
          <Link
            href="/checkout"
            className="relative inline-flex h-10 items-center gap-2 rounded-md bg-leaf px-3 text-sm font-semibold text-white transition hover:bg-bark"
          >
            <ShoppingBasket size={18} />
            <span>{totalItems}</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
