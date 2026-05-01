import { BarChart3, Boxes, ClipboardList, Home } from "lucide-react";
import Link from "next/link";

const items = [
  { href: "/admin", label: "ภาพรวม", icon: Home },
  { href: "/admin/products", label: "สินค้า", icon: Boxes },
  { href: "/admin/orders", label: "ออเดอร์", icon: ClipboardList },
  { href: "/admin/sales", label: "ยอดขาย", icon: BarChart3 }
];

export function AdminNav() {
  return (
    <nav className="flex flex-wrap gap-2">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-stone-200 bg-white px-3 text-sm font-semibold text-stone-700 hover:bg-stone-100"
          >
            <Icon size={16} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
