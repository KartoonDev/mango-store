export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  stock: number;
  image_url: string | null;
  is_active: boolean;
  created_at?: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type OrderStatus =
  | "pending_payment_review"
  | "paid"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

export type Order = {
  id: string;
  customer_name: string;
  customer_phone: string;
  pickup_method: "pickup" | "delivery";
  pickup_date: string;
  delivery_address: string | null;
  note: string | null;
  total_amount: number;
  slip_url: string | null;
  status: OrderStatus;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
};

export type SiteContentRow = {
  key: string;
  value: string;
  updated_at?: string;
};

export type ExportPriceStatus = "open" | "pending" | "closed";

export type ExportPrice = {
  id: string;
  variety: string;
  grade: string;
  size_label: string;
  destination: string;
  price_min: number;
  price_max: number;
  unit: string;
  status: ExportPriceStatus;
  effective_date: string;
  note: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type FarmerPartnerStatus = "new" | "contacted" | "qualified" | "paused" | "rejected";

export type FarmerPartner = {
  id: string;
  farm_name: string;
  contact_name: string;
  phone: string;
  line_id: string | null;
  province: string;
  district: string | null;
  varieties: string;
  volume_kg: number | null;
  harvest_window: string;
  has_gap: boolean;
  certification_note: string | null;
  photo_url: string | null;
  note: string | null;
  admin_note: string | null;
  status: FarmerPartnerStatus;
  created_at: string;
  updated_at?: string;
};
