"use client";

import { BarChart3, Boxes, ClipboardList, Home, LayoutPanelLeft, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "ภาพรวม", icon: Home },
  { href: "/admin/products", label: "สินค้า", icon: Boxes },
  { href: "/admin/orders", label: "ออเดอร์", icon: ClipboardList },
  { href: "/admin/sales", label: "ยอดขาย", icon: BarChart3 },
  { href: "/admin/content", label: "จัดการหน้าเว็บ", icon: LayoutPanelLeft },
  { href: "/admin/settings", label: "ตั้งค่าร้าน", icon: Settings }
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="grid gap-1">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/admin" ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`inline-flex h-11 items-center gap-3 rounded-md px-3 text-sm font-semibold transition ${
              isActive ? "bg-cream text-leaf" : "text-white/78 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon size={16} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
