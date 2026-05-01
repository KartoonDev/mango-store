import { AdminNav } from "@/components/AdminNav";
import { AdminGate } from "@/components/AdminGate";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-bark">หลังบ้านสวนมะม่วง</p>
          <h1 className="text-3xl font-bold text-stone-950">Mango Store Admin</h1>
        </div>
        <Link href="/" className="text-sm font-semibold text-leaf">
          กลับหน้าร้าน
        </Link>
      </div>
      <AdminNav />
      <div className="mt-6">
        <AdminGate>{children}</AdminGate>
      </div>
    </main>
  );
}
