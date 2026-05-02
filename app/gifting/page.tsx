import { Gift, Leaf, Star } from "lucide-react";
import Link from "next/link";

const moments = [
  { title: "Birthday", label: "วันเกิด", icon: Gift },
  { title: "Congratulations", label: "แสดงความยินดี", icon: Star },
  { title: "Gratitude", label: "ขอบคุณ", icon: Leaf }
];

export default function GiftingPage() {
  return (
    <main className="bg-[#fffaf0]">
      <section className="grid bg-leaf text-white lg:grid-cols-2">
        <div className="min-h-[420px]">
          <img
            src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1400&q=80"
            alt="Gift box"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="grid content-center px-4 py-12 sm:px-10">
          <p className="text-sm font-semibold text-cream">Gifting & Moments</p>
          <h1 className="mt-2 text-4xl font-black leading-tight md:text-5xl">ของขวัญจากสวนที่ดูดีตั้งแต่แรกเห็น</h1>
          <p className="mt-4 max-w-xl leading-7 text-white/82">
            เหมาะสำหรับส่งแทนคำขอบคุณ ของฝากผู้ใหญ่ ลูกค้าองค์กร หรือช่วงเทศกาลที่ต้องการความพรีเมียมแต่ยังอบอุ่นแบบสวนไทย
          </p>
          <Link href="/selection" className="mt-7 inline-flex h-11 w-fit items-center rounded-md bg-cream px-5 text-sm font-bold text-leaf">
            เลือกสินค้า
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-4 sm:grid-cols-3">
          {moments.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="rounded-lg border border-stone-200 bg-white p-6 text-center shadow-sm">
                <Icon className="mx-auto text-leaf" size={30} />
                <h2 className="mt-4 text-xl font-bold text-stone-950">{item.title}</h2>
                <p className="mt-1 text-sm text-stone-500">{item.label}</p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
