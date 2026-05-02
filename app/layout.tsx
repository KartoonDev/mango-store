import { AppChrome } from "@/components/AppChrome";
import { CartProvider } from "@/components/CartProvider";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "สวนมะม่วงน้ำดอกไม้ | Mango Store",
  description: "ร้านออนไลน์สำหรับสั่งซื้อมะม่วงน้ำดอกไม้สดจากสวน"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>
        <CartProvider>
          <AppChrome>{children}</AppChrome>
        </CartProvider>
      </body>
    </html>
  );
}
