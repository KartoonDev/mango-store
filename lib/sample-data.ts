import type { Product } from "@/lib/types";

export const sampleProducts: Product[] = [
  {
    id: "sample-1",
    name: "มะม่วงน้ำดอกไม้สีทอง เกรดพรีเมียม",
    description: "ผลสวย เนื้อแน่น หวานหอม เหมาะสำหรับรับประทานสุกหรือเป็นของฝาก",
    price: 129,
    unit: "กก.",
    stock: 80,
    image_url:
      "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=1200&q=80",
    is_active: true
  },
  {
    id: "sample-2",
    name: "มะม่วงน้ำดอกไม้คัดกล่อง",
    description: "คัดขนาดใกล้เคียงกัน แพ็กกล่องพร้อมส่ง เหมาะสำหรับลูกค้าองค์กร",
    price: 590,
    unit: "กล่อง 5 กก.",
    stock: 24,
    image_url:
      "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=1200&q=80",
    is_active: true
  },
  {
    id: "sample-3",
    name: "มะม่วงดิบสำหรับยำและน้ำปลาหวาน",
    description: "กรอบ เปรี้ยวกำลังดี เก็บสดจากสวนตามรอบตัด",
    price: 79,
    unit: "กก.",
    stock: 50,
    image_url:
      "https://images.unsplash.com/photo-1629367308584-890112f494a8?auto=format&fit=crop&w=1200&q=80",
    is_active: true
  }
];

export const defaultProductImage =
  "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=1200&q=80";
