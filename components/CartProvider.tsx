"use client";

import type { CartItem, Product } from "@/lib/types";
import { createContext, useContext, useMemo, useState } from "react";

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

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}
