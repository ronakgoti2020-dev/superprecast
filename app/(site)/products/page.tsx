import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { ProductSearch } from "@/components/ProductSearch";

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
              { weight: { contains: q } },
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

      <div className="mt-8">
        <ProductSearch initialQ={q || ""} category={category} />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href={q ? `/products?q=${encodeURIComponent(q)}` : "/products"}
          className={`border px-4 py-2 text-sm ${!category ? "border-terracotta bg-terracotta text-cream" : "border-ink/15"}`}
        >
          All
        </Link>
        {categories.map((item) => (
          <Link
            key={item.id}
            href={
              q
                ? `/products?category=${item.slug}&q=${encodeURIComponent(q)}`
                : `/products?category=${item.slug}`
            }
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
