import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [products, inquiries, unread, categories] = await Promise.all([
    prisma.product.count(),
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { status: "new" } }),
    prisma.category.count(),
  ]);
  let projects = 0;
  try {
    projects = await prisma.project.count();
  } catch {
    projects = 0;
  }
  const latest = await prisma.inquiry.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { product: true },
  });

  return (
    <div>
      <h1 className="font-display text-4xl">Dashboard</h1>
      <p className="mt-2 text-ink-soft">Manage catalogue, enquiries, and company details.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Products", products, "/admin/products"],
          ["Categories", categories, "/admin/categories"],
          ["Our work", projects, "/admin/work"],
          ["New enquiries", unread, "/admin/inquiries"],
        ].map(([label, value, href]) => (
          <Link key={label} href={String(href)} className="border border-ink/10 bg-paper p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-gold">{label}</p>
            <p className="mt-3 font-display text-4xl">{value}</p>
          </Link>
        ))}
      </div>
      <div className="mt-10 border border-ink/10 bg-paper p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-display text-2xl">Latest enquiries ({inquiries})</h2>
          <Link href="/admin/inquiries" className="text-sm text-terracotta">
            View all
          </Link>
        </div>
        <form action="/admin/inquiries" className="mt-4 flex max-w-md gap-2">
          <input
            type="search"
            name="q"
            placeholder="Search by name or mobile number"
            className="min-w-0 flex-1 border border-ink/15 bg-sand px-4 py-3"
            aria-label="Search enquiries by name or mobile number"
          />
          <button type="submit" className="bg-ink px-4 py-3 text-sm text-cream">
            Search
          </button>
        </form>
        <div className="mt-4 divide-y divide-ink/10">
          {latest.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3 text-sm">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-ink-soft">
                  {item.product?.name || "General enquiry"} · {item.phone}
                </p>
              </div>
              <span className="uppercase tracking-wide text-xs text-terracotta">{item.status}</span>
            </div>
          ))}
          {latest.length === 0 ? <p className="py-6 text-ink-soft">No enquiries yet.</p> : null}
        </div>
      </div>
    </div>
  );
}
