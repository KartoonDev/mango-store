"use client";

import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { defaultProductImage } from "@/lib/sample-data";
import type { Product } from "@/lib/types";
import { Edit3, Plus, Save, Trash2, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  async function loadProducts() {
    if (!supabase) return;
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts((data || []) as Product[]);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function uploadProductImage(file: File) {
    if (!supabase) {
      throw new Error("กรุณาตั้งค่า Supabase ก่อนอัปโหลดรูปสินค้า");
    }

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;

    if (sessionError || !accessToken) {
      throw new Error(sessionError?.message || "กรุณา login ใหม่ก่อนอัปโหลดรูปสินค้า");
    }

    const uploadForm = new FormData();
    uploadForm.append("file", file);

    const response = await fetch("/api/admin/product-image", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      body: uploadForm
    });
    const result = (await response.json()) as { url?: string; error?: string };

    if (!response.ok || !result.url) {
      throw new Error(result.error || "อัปโหลดรูปสินค้าไม่สำเร็จ");
    }

    return result.url;
  }

  async function resolveImageUrl(formData: FormData, currentImageUrl = "") {
    let imageUrl = String(formData.get("image_url") || currentImageUrl || "");
    const imageFile = formData.get("image_file");

    if (imageFile instanceof File && imageFile.size > 0) {
      imageUrl = await uploadProductImage(imageFile);
    }

    return imageUrl;
  }

  function productPayloadFromForm(formData: FormData, imageUrl: string) {
    return {
      name: String(formData.get("name")),
      description: String(formData.get("description")),
      price: Number(formData.get("price")),
      unit: String(formData.get("unit")),
      stock: Number(formData.get("stock")),
      image_url: imageUrl,
      is_active: formData.get("is_active") === "on"
    };
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    if (!supabase) {
      setMessage("กรุณาตั้งค่า Supabase ก่อนเพิ่มสินค้า");
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    setIsSaving(true);
    try {
      const imageUrl = await resolveImageUrl(formData);
      const { error } = await supabase.from("products").insert(productPayloadFromForm(formData, imageUrl));

      if (error) {
        setMessage(error.message);
        return;
      }

      form.reset();
      setMessage("เพิ่มสินค้าแล้ว");
      setIsFormOpen(false);
      loadProducts();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "เพิ่มสินค้าไม่สำเร็จ");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    if (!supabase || !editingProduct) return;

    const formData = new FormData(event.currentTarget);
    setIsSaving(true);

    try {
      const imageUrl = await resolveImageUrl(formData, editingProduct.image_url || "");
      const { error } = await supabase
        .from("products")
        .update(productPayloadFromForm(formData, imageUrl))
        .eq("id", editingProduct.id);

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage("อัปเดตสินค้าแล้ว");
      setEditingProduct(null);
      setIsFormOpen(false);
      loadProducts();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "อัปเดตสินค้าไม่สำเร็จ");
    } finally {
      setIsSaving(false);
    }
  }

  async function updateProduct(product: Product, patch: Partial<Product>) {
    if (!supabase) return;
    const { error } = await supabase.from("products").update(patch).eq("id", product.id);
    setMessage(error ? error.message : "บันทึกสินค้าแล้ว");
    loadProducts();
  }

  async function deleteProduct(product: Product) {
    if (!supabase) return;
    const confirmed = window.confirm(`ลบสินค้า "${product.name}" ใช่ไหม? การลบนี้ย้อนกลับไม่ได้`);
    if (!confirmed) return;

    const { error } = await supabase.from("products").delete().eq("id", product.id);
    setMessage(error ? error.message : "ลบสินค้าแล้ว");
    if (!error && editingProduct?.id === product.id) {
      setEditingProduct(null);
      setIsFormOpen(false);
    }
    loadProducts();
  }

  function openCreateForm() {
    setMessage("");
    setEditingProduct(null);
    setIsFormOpen(true);
  }

  function openEditForm(product: Product) {
    setMessage("");
    setEditingProduct(product);
    setIsFormOpen(true);
  }

  function closeForm() {
    setEditingProduct(null);
    setIsFormOpen(false);
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-col justify-between gap-3 rounded-lg border border-stone-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-stone-950">สินค้า</h2>
          <p className="mt-1 text-sm text-stone-500">จัดการสินค้า ราคา สต็อก รูปภาพ และสถานะการแสดงผล</p>
        </div>
        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-leaf px-4 font-semibold text-white hover:bg-bark"
        >
          <Plus size={18} />
          Add
        </button>
      </div>

      {message && <p className="rounded-md bg-white p-3 text-sm text-stone-700 shadow-sm">{message}</p>}

      <div className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-left text-sm">
            <thead className="bg-cream text-stone-800">
              <tr>
                <th className="px-4 py-3 font-bold">สินค้า</th>
                <th className="px-4 py-3 font-bold">ราคา</th>
                <th className="px-4 py-3 font-bold">สต็อก</th>
                <th className="px-4 py-3 font-bold">สถานะ</th>
                <th className="px-4 py-3 text-right font-bold">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {products.map((product) => (
                <tr key={product.id} className="align-middle">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image_url || defaultProductImage}
                        alt={product.name}
                        className="h-14 w-14 rounded-md object-cover"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-stone-950">{product.name}</p>
                        <p className="line-clamp-1 max-w-md text-xs text-stone-500">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-leaf">
                    ฿{Number(product.price).toLocaleString("th-TH")} / {product.unit}
                  </td>
                  <td className="px-4 py-3 text-stone-700">{product.stock}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => updateProduct(product, { is_active: !product.is_active })}
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        product.is_active ? "bg-grove/15 text-leaf" : "bg-stone-100 text-stone-500"
                      }`}
                    >
                      {product.is_active ? "เปิดขาย" : "ปิดขาย"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEditForm(product)}
                        className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-200 px-3 font-semibold hover:bg-stone-100"
                      >
                        <Edit3 size={15} />
                        แก้ไข
                      </button>
                      <button
                        onClick={() => updateProduct(product, { stock: Math.max(0, product.stock - 1) })}
                        className="h-9 rounded-md border border-stone-200 px-3 font-semibold hover:bg-stone-100"
                      >
                        ลดสต็อก
                      </button>
                      <button
                        onClick={() => deleteProduct(product)}
                        className="inline-flex h-9 items-center gap-2 rounded-md px-3 font-semibold text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={15} />
                        ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="p-6 text-sm text-stone-500">
              ยังไม่มีสินค้าในฐานข้อมูล
            </div>
          )}
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-stone-950/45 px-4 py-6">
          <form
            onSubmit={editingProduct ? handleUpdate : handleCreate}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-stone-200 bg-white p-5 shadow-xl"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-xl font-bold text-stone-950">
                {editingProduct ? <Edit3 size={20} /> : <Plus size={20} />}
                {editingProduct ? "แก้ไขสินค้า" : "เพิ่มสินค้า"}
              </h2>
              <button
                type="button"
                onClick={closeForm}
                className="grid h-9 w-9 place-items-center rounded-md border border-stone-200 text-stone-600 hover:bg-stone-100"
                title="ปิด"
              >
                <X size={17} />
              </button>
            </div>
            {!isSupabaseConfigured && <p className="mt-2 text-sm text-stone-500">ต้องตั้งค่า Supabase ก่อนบันทึกจริง</p>}
            <div className="mt-5 grid gap-4">
              <label className="grid gap-1">
                <span className="label">ชื่อสินค้า</span>
                <input
                  name="name"
                  required
                  defaultValue={editingProduct?.name || ""}
                  className="field"
                  placeholder="มะม่วงน้ำดอกไม้สีทอง เกรดพรีเมียม"
                  key={`name-${editingProduct?.id || "new"}`}
                />
              </label>
              <label className="grid gap-1">
                <span className="label">รายละเอียด</span>
                <textarea
                  name="description"
                  required
                  defaultValue={editingProduct?.description || ""}
                  className="field min-h-24"
                  key={`description-${editingProduct?.id || "new"}`}
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="grid gap-1">
                  <span className="label">ราคา</span>
                  <input
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    defaultValue={editingProduct?.price ?? ""}
                    className="field"
                    key={`price-${editingProduct?.id || "new"}`}
                  />
                </label>
                <label className="grid gap-1">
                  <span className="label">หน่วย</span>
                  <input
                    name="unit"
                    required
                    defaultValue={editingProduct?.unit || "กก."}
                    className="field"
                    key={`unit-${editingProduct?.id || "new"}`}
                  />
                </label>
                <label className="grid gap-1">
                  <span className="label">สต็อก</span>
                  <input
                    name="stock"
                    type="number"
                    min="0"
                    required
                    defaultValue={editingProduct?.stock ?? ""}
                    className="field"
                    key={`stock-${editingProduct?.id || "new"}`}
                  />
                </label>
              </div>
              {editingProduct?.image_url && (
                <div className="flex items-center gap-3 rounded-md border border-stone-200 p-3">
                  <img src={editingProduct.image_url} alt={editingProduct.name} className="h-14 w-14 rounded-md object-cover" />
                  <p className="text-sm text-stone-600">รูปปัจจุบัน ถ้าอัปโหลดรูปใหม่จะใช้รูปใหม่แทน</p>
                </div>
              )}
              <label className="grid gap-1">
                <span className="label">อัปโหลดรูปสินค้า</span>
                <input name="image_file" type="file" accept="image/*" className="field" />
              </label>
              <label className="grid gap-1">
                <span className="label">หรือใส่ลิงก์รูปสินค้า</span>
                <input
                  name="image_url"
                  type="url"
                  defaultValue={editingProduct?.image_url || ""}
                  className="field"
                  placeholder="https://..."
                  key={`image-${editingProduct?.id || "new"}`}
                />
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold text-stone-700">
                <input
                  name="is_active"
                  type="checkbox"
                  defaultChecked={editingProduct?.is_active ?? true}
                  key={`active-${editingProduct?.id || "new"}`}
                />
                เปิดขาย
              </label>
              <div className="flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-stone-200 px-4 font-semibold text-stone-700"
                >
                  <X size={17} />
                  ยกเลิก
                </button>
                <button
                  disabled={isSaving}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-leaf px-5 font-semibold text-white disabled:opacity-60"
                >
                  <Save size={17} />
                  {isSaving ? "กำลังบันทึก..." : editingProduct ? "บันทึกการแก้ไข" : "บันทึกสินค้า"}
                </button>
              </div>
              {message && <p className="rounded-md bg-stone-100 p-3 text-sm text-stone-700">{message}</p>}
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
