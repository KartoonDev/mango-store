"use client";

import { useCart } from "@/components/CartProvider";
import { defaultProductImage } from "@/lib/sample-data";
import type { Product } from "@/lib/types";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <article className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
      <Link href={`/product/${product.id}`} className="block">
        <img
          src={product.image_url || defaultProductImage}
          alt={product.name}
          className="h-56 w-full object-cover"
        />
      </Link>
      <div className="space-y-4 p-4">
        <div>
          <Link href={`/product/${product.id}`} className="text-lg font-semibold text-stone-950">
            {product.name}
          </Link>
          <p className="mt-1 line-clamp-2 text-sm text-stone-600">{product.description}</p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xl font-bold text-leaf">฿{product.price.toLocaleString("th-TH")}</p>
            <p className="text-xs text-stone-500">ต่อ {product.unit} · เหลือ {product.stock}</p>
          </div>
          <button
            type="button"
            onClick={() => addItem(product)}
            disabled={product.stock <= 0}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-mango px-3 text-sm font-semibold text-stone-950 transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:bg-stone-200"
          >
            <ShoppingCart size={17} />
            เพิ่ม
          </button>
        </div>
      </div>
    </article>
  );
}
