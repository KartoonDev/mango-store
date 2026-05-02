"use client";

import { useCart } from "@/components/CartProvider";
import { defaultProductImage } from "@/lib/sample-data";
import type { Product } from "@/lib/types";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <article className="group overflow-hidden rounded-lg bg-white text-center shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <Link href={`/product/${product.id}`} className="block">
        <img
          src={product.image_url || defaultProductImage}
          alt={product.name}
          className="h-56 w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </Link>
      <div className="space-y-3 p-4">
        <div>
          <Link href={`/product/${product.id}`} className="text-lg font-bold text-stone-950">
            {product.name}
          </Link>
          <p className="mt-1 line-clamp-2 text-xs text-stone-600">{product.description}</p>
        </div>
        <div className="grid justify-items-center gap-2">
          <div>
            <p className="text-base font-bold text-stone-950">฿{product.price.toLocaleString("th-TH")}</p>
            <p className="text-xs text-stone-500">ต่อ {product.unit} · เหลือ {product.stock}</p>
          </div>
          <button
            type="button"
            onClick={() => addItem(product)}
            disabled={product.stock <= 0}
            className="inline-flex h-9 items-center gap-2 rounded-full bg-leaf px-5 text-xs font-semibold text-white transition hover:bg-bark disabled:cursor-not-allowed disabled:bg-stone-200"
          >
            <ShoppingCart size={17} />
            เพิ่ม
          </button>
        </div>
      </div>
    </article>
  );
}
