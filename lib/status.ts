import type { OrderStatus } from "@/lib/types";

export const orderStatusLabels: Record<OrderStatus, string> = {
  pending_payment_review: "รอตรวจชำระเงิน",
  paid: "ชำระแล้ว",
  preparing: "เตรียมสินค้า",
  ready: "พร้อมรับ/นัดส่ง",
  completed: "สำเร็จ",
  cancelled: "ยกเลิก"
};

export const orderStatusOptions = Object.entries(orderStatusLabels).map(([value, label]) => ({
  value: value as OrderStatus,
  label
}));
