import { Award, PackageCheck, Sprout, Truck } from "lucide-react";
import Link from "next/link";

const storyCards = [
  { title: "คัดตามรอบตัดจริง", text: "เลือกผลที่แก่และเหมาะกับการส่งถึงลูกค้าปลายทาง", icon: Sprout },
  { title: "แพ็กอย่างเป็นระบบ", text: "ลดการช้ำระหว่างขนส่งและทำให้กล่องดูพรีเมียม", icon: PackageCheck },
  { title: "ส่งต่อความสด", text: "จัดการวันรับเองหรือนัดส่งตามรอบที่ลูกค้าเลือก", icon: Truck },
  { title: "คุณภาพสม่ำเสมอ", text: "ใช้ระบบหลังบ้านติดตามสินค้า ออเดอร์ และยอดขาย", icon: Award }
];

export default function StoryPage() {
  return (
    <main className="bg-[#fffdf6]">
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold text-grove">From the Farm to Your Table</p>
          <h1 className="mt-2 text-4xl font-black leading-tight text-stone-950 md:text-5xl">จากสวนมะม่วงสู่โต๊ะของคุณ</h1>
          <p className="mt-4 leading-7 text-stone-600">
            เราคัดมะม่วงตามรอบตัดจริง ดูแลความสุก แพ็กอย่างระมัดระวัง และจัดการออเดอร์ผ่านระบบหลังบ้าน เพื่อให้ทุกกล่องส่งถึงลูกค้าอย่างเป็นระเบียบ
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/selection" className="inline-flex h-10 items-center rounded-md bg-leaf px-5 text-sm font-semibold text-white">
              เลือกสินค้า
            </Link>
            <Link href="/export" className="inline-flex h-10 items-center rounded-md border border-leaf px-5 text-sm font-semibold text-leaf">
              ราคาส่งออก
            </Link>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <img
            src="https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=900&q=80"
            alt="Mango farm"
            className="h-64 w-full rounded-lg object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=900&q=80"
            alt="Farm landscape"
            className="h-64 w-full rounded-lg object-cover"
          />
        </div>
      </section>

      <section className="bg-[#f2edc2]/55 px-4 py-12">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
          {storyCards.map((card) => {
            const Icon = card.icon;
            return (
              <article key={card.title} className="rounded-lg border border-leaf/10 bg-white p-5 shadow-sm">
                <span className="grid h-11 w-11 place-items-center rounded-md bg-[#9fcb98]/35 text-leaf">
                  <Icon size={21} />
                </span>
                <h2 className="mt-4 font-bold text-stone-950">{card.title}</h2>
                <p className="mt-2 text-sm leading-6 text-stone-600">{card.text}</p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
