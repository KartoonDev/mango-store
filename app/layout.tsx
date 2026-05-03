import { AppChrome } from "@/components/AppChrome";
import { CartProvider } from "@/components/CartProvider";
import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Thai, Sarabun } from "next/font/google";
import "./globals.css";

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans-thai",
  display: "swap"
});

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sarabun",
  display: "swap"
});

export const metadata: Metadata = {
  title: "มะม่วงสุกสีทอง หวานหอม ส่งตรงจากสวน | Mango Fresh",
  description: "ขายมะม่วงสุกคุณภาพดี สีทองสวย หวานหอม เนื้อเนียน สดใหม่จากสวน พร้อมส่งทั่วประเทศ ราคาดี ส่งไว",
  keywords: ["มะม่วงสุก", "มะม่วงหวาน", "มะม่วงน้ำดอกไม้", "ผลไม้สด", "มะม่วงส่งตรง", "ขายมะม่วงออนไลน์"],
  authors: [{ name: "Mango Fresh" }],
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg"
  },
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    title: "มะม่วงสุกสีทอง หวานหอม ส่งตรงจากสวน",
    description: "มะม่วงคุณภาพดี หวานฉ่ำ สดใหม่ พร้อมส่งถึงบ้าน",
    images: ["https://yourdomain.com/mango.jpg"],
    type: "website",
    url: "https://yourdomain.com"
  },
  twitter: {
    card: "summary_large_image",
    title: "มะม่วงสุกสีทอง หวานหอม",
    description: "สดจากสวน หวานฉ่ำทุกคำ",
    images: ["https://yourdomain.com/mango.jpg"]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1
};

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "มะม่วงสุกสีทอง",
  image: "https://yourdomain.com/mango.jpg",
  description: "มะม่วงหวานหอม สดจากสวน",
  brand: {
    "@type": "Brand",
    name: "Mango Fresh"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${ibmPlexSansThai.variable} ${sarabun.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
        <CartProvider>
          <AppChrome>{children}</AppChrome>
        </CartProvider>
      </body>
    </html>
  );
}
