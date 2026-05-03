"use client";

import { useCart } from "@/components/CartProvider";
import { LayoutDashboard, ShoppingBasket, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/selection", label: "Our Selection" },
  { href: "/export", label: "ราคาส่งออก" },
  { href: "/gifting", label: "Gifting" },
  { href: "/story", label: "Story" },
  { href: "/contact", label: "Contact" }
];

export function Header() {
  const { totalItems } = useCart();
  const pathname = usePathname();
  const previousTotalItems = useRef(totalItems);
  const [isCartBumping, setIsCartBumping] = useState(false);

  useEffect(() => {
    if (totalItems > previousTotalItems.current) {
      setIsCartBumping(true);
      const timer = setTimeout(() => setIsCartBumping(false), 520);
      previousTotalItems.current = totalItems;
      return () => clearTimeout(timer);
    }
    previousTotalItems.current = totalItems;
  }, [totalItems]);

  return (
    <header className="sticky top-0 z-20 border-b border-leaf/10 bg-white/95 backdrop-blur">
      <div className="h-2 bg-cream md:h-3" />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border-2 border-cream bg-white shadow-soft">
            <span className="grid h-11 w-11 place-items-center rounded-full border border-leaf/20 bg-[#fffaf0] text-center text-[8px] font-bold leading-tight text-leaf">
              สวนมะม่วง<br />น้ำดอกไม้
            </span>
          </span>
          <span className="hidden min-w-0 sm:block">
            <span className="block truncate text-sm font-black text-leaf">สวนมะม่วงน้ำดอกไม้</span>
            <span className="block truncate text-xs font-semibold text-stone-500">Little Orchard Online Store</span>
          </span>
        </Link>

        <nav className="hidden items-center justify-center gap-1 rounded-full border border-leaf/10 bg-[#fffaf0] p-1 text-sm font-bold text-stone-700 lg:flex">
          {navItems.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 transition ${
                  isActive ? "bg-leaf text-white shadow-sm" : "hover:bg-white hover:text-leaf"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <nav className="flex shrink-0 items-center justify-end gap-2">
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
            className={`relative inline-flex h-10 items-center gap-2 rounded-md bg-leaf px-3 text-sm font-semibold text-white transition hover:bg-bark ${
              isCartBumping ? "cart-bump" : ""
            }`}
          >
            <ShoppingBasket size={18} />
            <span className="min-w-4 text-center">{totalItems}</span>
          </Link>
        </nav>
      </div>
      <nav className="scrollbar-hide flex gap-1 overflow-x-auto border-t border-leaf/10 px-3 py-2 text-sm font-bold text-stone-700 lg:hidden">
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 rounded-full px-3 py-2 transition ${
                isActive ? "bg-leaf text-white" : "bg-[#fffaf0] hover:text-leaf"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
