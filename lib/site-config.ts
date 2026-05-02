export type SiteContent = {
  hero_badge: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string;
  products_heading: string;
  products_note: string;
  promo_text: string;
};

export type StoreSettings = {
  accept_orders: boolean;
  announcement: string;
  pickup_note: string;
  contact_phone: string;
  contact_line: string;
  contact_facebook: string;
  bank_account_name: string;
  bank_account_number: string;
  bank_name: string;
  qr_image_url: string;
};

export const defaultSiteContent: SiteContent = {
  hero_badge: "เก็บสดจากสวนตามรอบตัด",
  hero_title: "สวนมะม่วงน้ำดอกไม้",
  hero_subtitle: "สั่งมะม่วงคัดเกรด เลือกวันรับเองหรือนัดส่ง พร้อมแนบสลิปโอนเงินในระบบเดียว",
  hero_image_url:
    "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=1800&q=80",
  products_heading: "สินค้าในสวน",
  products_note: "เชื่อมต่อ Supabase แล้ว ข้อมูลจะมาจากฐานข้อมูลจริง",
  promo_text: "รับเอง / นัดส่งตามวันที่เลือก"
};

export const defaultStoreSettings: StoreSettings = {
  accept_orders: true,
  announcement: "เปิดรับออเดอร์มะม่วงน้ำดอกไม้ตามรอบตัดประจำสัปดาห์",
  pickup_note: "รับเองที่สวนหรือนัดส่งตามวันที่เลือก",
  contact_phone: "",
  contact_line: "",
  contact_facebook: "",
  bank_account_name: "",
  bank_account_number: "",
  bank_name: "",
  qr_image_url: ""
};

export const siteContentFields: Array<{ key: keyof SiteContent; label: string; type?: "textarea" | "url" }> = [
  { key: "hero_badge", label: "ป้ายข้อความบน Hero" },
  { key: "hero_title", label: "หัวข้อ Hero" },
  { key: "hero_subtitle", label: "คำอธิบาย Hero", type: "textarea" },
  { key: "hero_image_url", label: "ลิงก์รูป Hero", type: "url" },
  { key: "products_heading", label: "หัวข้อสินค้า" },
  { key: "products_note", label: "ข้อความใต้หัวข้อสินค้า", type: "textarea" },
  { key: "promo_text", label: "ข้อความวิธีรับสินค้า" }
];

export const storeSettingFields: Array<{ key: keyof StoreSettings; label: string; type?: "textarea" | "url" }> = [
  { key: "announcement", label: "ประกาศหน้าร้าน", type: "textarea" },
  { key: "pickup_note", label: "รายละเอียดรับเอง/นัดส่ง", type: "textarea" },
  { key: "contact_phone", label: "เบอร์โทร" },
  { key: "contact_line", label: "Line ID / Line URL" },
  { key: "contact_facebook", label: "Facebook URL", type: "url" },
  { key: "bank_account_name", label: "ชื่อบัญชี" },
  { key: "bank_account_number", label: "เลขบัญชี" },
  { key: "bank_name", label: "ธนาคาร" },
  { key: "qr_image_url", label: "ลิงก์รูป QR โอนเงิน", type: "url" }
];
