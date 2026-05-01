"use client";

import { useCart } from "@/components/CartProvider";
import { defaultProductImage } from "@/lib/sample-data";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { Minus, Plus, Send, Trash2 } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

export default function CheckoutPage() {
  const { items, totalAmount, updateQuantity, removeItem, clearCart } = useCart();
  const [pickupMethod, setPickupMethod] = useState<"pickup" | "delivery">("pickup");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!supabase) {
      setMessage("ยังไม่ได้ตั้งค่า Supabase: ตอนนี้ส่งออเดอร์จริงไม่ได้ แต่ UI พร้อมใช้งานแล้ว");
      return;
    }

    if (!items.length) {
      setMessage("กรุณาเลือกสินค้าอย่างน้อย 1 รายการ");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const slip = formData.get("slip") as File | null;
    setIsSubmitting(true);

    try {
      let slipUrl: string | null = null;

      if (slip && slip.size > 0) {
        const filePath = `${Date.now()}-${slip.name}`;
        const { error } = await supabase.storage.from("payment-slips").upload(filePath, slip);
        if (error) throw error;
        const { data } = supabase.storage.from("payment-slips").getPublicUrl(filePath);
        slipUrl = data.publicUrl;
      }

      const orderId = crypto.randomUUID();
      const { error: orderError } = await supabase
        .from("orders")
        .insert({
          id: orderId,
          customer_name: String(formData.get("customer_name")),
          customer_phone: String(formData.get("customer_phone")),
          pickup_method: pickupMethod,
          pickup_date: String(formData.get("pickup_date")),
          delivery_address: String(formData.get("delivery_address") || ""),
          note: String(formData.get("note") || ""),
          total_amount: totalAmount,
          slip_url: slipUrl,
          status: "pending_payment_review"
        });

      if (orderError) throw orderError;

      const { error: itemError } = await supabase.from("order_items").insert(
        items.map((item) => ({
          order_id: orderId,
          product_id: item.product.id,
          product_name: item.product.name,
          quantity: item.quantity,
          unit_price: item.product.price,
          line_total: item.product.price * item.quantity
        }))
      );

      if (itemError) throw itemError;
      clearCart();
      event.currentTarget.reset();
      setMessage("ส่งออเดอร์สำเร็จแล้ว เจ้าของสวนจะตรวจสลิปและติดต่อกลับ");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "ส่งออเดอร์ไม่สำเร็จ");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[0.9fr_1.1fr]">
      <section>
        <h1 className="text-3xl font-bold text-stone-950">ตะกร้าสินค้า</h1>
        <div className="mt-5 space-y-3">
          {items.length === 0 ? (
            <div className="rounded-lg border border-stone-200 bg-white p-6 text-stone-600">
              ยังไม่มีสินค้าในตะกร้า <Link href="/" className="font-semibold text-leaf">เลือกสินค้า</Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="rounded-lg border border-stone-200 bg-white p-4">
                <div className="flex gap-4">
                  <img
                    src={item.product.image_url || defaultProductImage}
                    alt={item.product.name}
                    className="h-20 w-20 rounded-md object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-stone-950">{item.product.name}</h2>
                    <p className="text-sm text-stone-500">
                      ฿{item.product.price.toLocaleString("th-TH")} / {item.product.unit}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="grid h-8 w-8 place-items-center rounded-md border border-stone-200"
                        title="ลดจำนวน"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="grid h-8 w-8 place-items-center rounded-md border border-stone-200"
                        title="เพิ่มจำนวน"
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item.product.id)}
                        className="ml-auto grid h-8 w-8 place-items-center rounded-md text-red-600 hover:bg-red-50"
                        title="ลบสินค้า"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-5 rounded-lg bg-leaf p-5 text-white">
          <p className="text-sm text-white/75">ยอดรวม</p>
          <p className="text-3xl font-bold">฿{totalAmount.toLocaleString("th-TH")}</p>
        </div>
      </section>

      <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-bold text-stone-950">ข้อมูลสั่งซื้อ</h2>
        {!isSupabaseConfigured && (
          <p className="mt-2 rounded-md bg-yellow-50 p-3 text-sm text-yellow-900">
            โหมดเดโม: ตั้งค่า Supabase ใน `.env.local` เพื่อส่งออเดอร์จริง
          </p>
        )}
        <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
          <label className="grid gap-1">
            <span className="label">ชื่อผู้สั่งซื้อ</span>
            <input name="customer_name" required className="field" />
          </label>
          <label className="grid gap-1">
            <span className="label">เบอร์โทร</span>
            <input name="customer_phone" required className="field" />
          </label>
          <div className="grid gap-2">
            <span className="label">วิธีรับสินค้า</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPickupMethod("pickup")}
                className={`rounded-md border px-3 py-2 text-sm font-semibold ${
                  pickupMethod === "pickup" ? "border-leaf bg-leaf text-white" : "border-stone-200"
                }`}
              >
                รับเอง
              </button>
              <button
                type="button"
                onClick={() => setPickupMethod("delivery")}
                className={`rounded-md border px-3 py-2 text-sm font-semibold ${
                  pickupMethod === "delivery" ? "border-leaf bg-leaf text-white" : "border-stone-200"
                }`}
              >
                นัดส่ง
              </button>
            </div>
          </div>
          <label className="grid gap-1">
            <span className="label">วันที่ต้องการรับ/ส่ง</span>
            <input name="pickup_date" type="date" required className="field" />
          </label>
          <label className="grid gap-1">
            <span className="label">ที่อยู่หรือรายละเอียดนัดหมาย</span>
            <textarea name="delivery_address" rows={3} className="field" />
          </label>
          <label className="grid gap-1">
            <span className="label">แนบสลิปโอนเงิน</span>
            <input name="slip" type="file" accept="image/*" className="field" />
          </label>
          <label className="grid gap-1">
            <span className="label">หมายเหตุ</span>
            <textarea name="note" rows={2} className="field" />
          </label>
          <button
            disabled={isSubmitting}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-mango px-4 font-bold text-stone-950 hover:bg-yellow-400 disabled:opacity-60"
          >
            <Send size={18} />
            {isSubmitting ? "กำลังส่ง..." : "ส่งออเดอร์"}
          </button>
          {message && <p className="rounded-md bg-stone-100 p-3 text-sm text-stone-700">{message}</p>}
        </form>
      </section>
    </main>
  );
}
