import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Products",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  const products = await prisma.product.findMany({
    where: {
      ...(category ? { category: { slug: category } } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q } },
              { description: { contains: q } },
              { color: { contains: q } },
              { design: { contains: q } },
            ],
          }
        : {}),
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-6xl px-5 py-16">
      <p className="text-xs uppercase tracking-[0.28em] text-terracotta">Catalogue</p>
      <h1 className="mt-3 font-display text-5xl">Products</h1>
      <p className="mt-4 max-w-2xl text-ink-soft">
        Concrete jali, kerb stones, paver blocks, and cover blocks. Filter by
        category or search by name, colour, or design.
      </p>

      <form className="mt-8 flex flex-wrap gap-3">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search products"
          className="min-w-56 flex-1 border border-ink/15 bg-paper px-4 py-3"
        />
        {category ? <input type="hidden" name="category" value={category} /> : null}
        <button className="bg-ink px-5 py-3 text-sm text-cream">Search</button>
      </form>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/products"
          className={`border px-4 py-2 text-sm ${!category ? "border-terracotta bg-terracotta text-cream" : "border-ink/15"}`}
        >
          All
        </Link>
        {categories.map((item) => (
          <Link
            key={item.id}
            href={`/products?category=${item.slug}`}
            className={`border px-4 py-2 text-sm ${
              category === item.slug
                ? "border-terracotta bg-terracotta text-cream"
                : "border-ink/15"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {products.length === 0 ? (
        <p className="mt-10 text-ink-soft">No products match this filter yet.</p>
      ) : null}
    </main>
  );
}
