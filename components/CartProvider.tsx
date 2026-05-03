"use client";

import type { CartItem, Product } from "@/lib/types";
import { CheckCircle2, ShoppingBasket } from "lucide-react";
import { createContext, useContext, useMemo, useRef, useState } from "react";

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  addItem: (product: Product) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [lastAddedProduct, setLastAddedProduct] = useState<Product | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const value = useMemo<CartContextValue>(() => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.product.price, 0);

    return {
      items,
      totalItems,
      totalAmount,
      addItem(product) {
        setItems((current) => {
          const existing = current.find((item) => item.product.id === product.id);
          if (existing) {
            return current.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
                : item
            );
          }
          return [...current, { product, quantity: 1 }];
        });
        setLastAddedProduct(product);
        if (toastTimerRef.current) {
          clearTimeout(toastTimerRef.current);
        }
        toastTimerRef.current = setTimeout(() => setLastAddedProduct(null), 2400);
      },
      updateQuantity(productId, quantity) {
        setItems((current) =>
          current
            .map((item) =>
              item.product.id === productId
                ? { ...item, quantity: Math.min(Math.max(quantity, 1), item.product.stock) }
                : item
            )
            .filter((item) => item.quantity > 0)
        );
      },
      removeItem(productId) {
        setItems((current) => current.filter((item) => item.product.id !== productId));
      },
      clearCart() {
        setItems([]);
      }
    };
  }, [items]);

  return (
    <CartContext.Provider value={value}>
      {children}
      {lastAddedProduct && (
        <div className="pointer-events-none fixed bottom-5 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 sm:left-auto sm:right-5 sm:translate-x-0">
          <div className="cart-toast flex items-center gap-3 rounded-lg border border-leaf/15 bg-white p-3 shadow-soft">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-grove/15 text-leaf">
              <CheckCircle2 size={22} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-stone-950">เพิ่มลงตะกร้าแล้ว</p>
              <p className="truncate text-xs text-stone-500">{lastAddedProduct.name}</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-cream px-3 py-1 text-xs font-bold text-leaf">
              <ShoppingBasket size={14} />
              {value.totalItems}
            </span>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}
