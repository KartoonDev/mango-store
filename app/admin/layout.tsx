import { AdminNav } from "@/components/AdminNav";
import { AdminGate } from "@/components/AdminGate";
import { Sprout } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#fbf9e9] lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="bg-leaf px-4 py-5 text-white lg:sticky lg:top-0 lg:h-screen">
        <div className="flex items-center gap-3 rounded-lg bg-white/10 p-3">
          <span className="grid h-11 w-11 place-items-center rounded-md bg-cream text-leaf">
            <Sprout size={22} />
          </span>
          <div>
            <p className="text-sm text-white/70">หลังบ้านสวนมะม่วง</p>
            <h1 className="text-lg font-bold">Mango Store</h1>
          </div>
        </div>
        <div className="mt-5">
          <AdminNav />
        </div>
        <Link
          href="/"
          className="mt-6 inline-flex h-10 w-full items-center justify-center rounded-md border border-white/20 text-sm font-semibold text-white hover:bg-white/10"
        >
          กลับหน้าร้าน
        </Link>
      </aside>

      <section className="min-w-0 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <AdminGate>{children}</AdminGate>
        </div>
      </section>
    </main>
  );
}
