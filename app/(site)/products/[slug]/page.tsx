import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductGallery } from "@/components/ProductGallery";
import { galleryUrls } from "@/lib/product-images";
import { ProductCard } from "@/components/ProductCard";
import { QuoteForm } from "@/components/QuoteForm";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  return { title: product?.name || "Product" };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true, images: { orderBy: { sortOrder: "asc" } } },
  });
  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id } },
    include: { category: true, images: { orderBy: { sortOrder: "asc" } } },
    take: 3,
  });

  const specs = [
    ["Category", product.category.name],
    ["Size", product.size],
    ["Colour", product.color],
    ["Weight", product.weight],
    ["Material", product.material],
    ["Design", product.design],
    ["Usage", product.usage],
    ["Shape", product.shape],
    ["MOQ", product.moq ? `${product.moq} ${product.priceUnit}` : null],
    ["Availability", product.inStock ? "In stock" : "Made to order"],
  ].filter(([, value]) => Boolean(value));

  return (
    <main className="mx-auto max-w-6xl px-5 py-16">
      <div className="grid gap-10 md:grid-cols-2">
        <ProductGallery
          images={galleryUrls(product)}
          name={product.name}
          design={product.design}
          color={product.color}
        />
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-terracotta">
            {product.category.name}
          </p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl">{product.name}</h1>
          <p className="mt-4 text-xl">{formatPrice(product.price, product.priceUnit)}</p>
          <p className="mt-6 text-base leading-8 text-ink-soft">{product.description}</p>
          <dl className="mt-8 grid grid-cols-2 gap-4 text-sm">
            {specs.map(([label, value]) => (
              <div key={label} className="border-t border-ink/10 pt-3">
                <dt className="text-ink-soft">{label}</dt>
                <dd className="mt-1 capitalize">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mt-16 grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl">Product details</h2>
          <ul className="mt-5 space-y-2 text-ink-soft">
            {product.details
              .split("\n")
              .filter(Boolean)
              .map((line) => (
                <li key={line}>{line}</li>
              ))}
          </ul>
        </div>
        <div className="border border-ink/10 bg-paper p-8">
          <h2 className="font-display text-3xl">Get a quote</h2>
          <div className="mt-6">
            <QuoteForm productId={product.id} productName={product.name} />
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-20">
          <h2 className="font-display text-3xl">Related products</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
