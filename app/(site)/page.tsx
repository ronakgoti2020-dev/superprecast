import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { ProductPhoto } from "@/components/ProductPhoto";
import { QuoteForm } from "@/components/QuoteForm";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, featured, productCount, delivered] = await Promise.all([
    prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.product.findMany({
      where: { featured: true },
      include: { category: true },
      take: 6,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count(),
    prisma.project.findMany({
      where: { featured: true },
      take: 3,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <main>
      <section className="jali-bg grain relative overflow-hidden text-cream">
        <div className="relative mx-auto grid min-h-[88vh] max-w-6xl items-center gap-12 px-5 py-20 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-gold">Since 2015 · Ankleshwar</p>
            <h1 className="mt-5 font-display text-5xl leading-[1.05] md:text-7xl">
              Where innovation meets elevation.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-stone">
              Super Precast crafts high-quality elevation blocks, jali, pavers,
              curbstones, and cover blocks — durable, precise, and made for
              residential, commercial, and industrial projects across Gujarat.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/products" className="bg-terracotta px-6 py-3 text-sm">
                Browse products
              </Link>
              <Link href="/contact" className="border border-cream/30 px-6 py-3 text-sm">
                Request a quote
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              ["2015", "Established"],
              [String(productCount), "Products"],
              ["4", "Categories"],
              ["GST", "Registered"],
            ].map(([value, label]) => (
              <div key={label} className="border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
                <p className="font-display text-4xl">{value}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-stone">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <p className="text-xs uppercase tracking-[0.28em] text-terracotta">Product range</p>
        <h2 className="mt-3 font-display text-4xl md:text-5xl">Built for elevation, edges, and outdoor floors.</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group border border-ink/10 bg-paper p-8 transition hover:border-terracotta"
            >
              <p className="text-sm text-ink-soft">{category._count.products} products</p>
              <h3 className="mt-3 font-display text-3xl group-hover:text-terracotta">{category.name}</h3>
              <p className="mt-3 max-w-md text-sm leading-7 text-ink-soft">{category.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-sand py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-terracotta">Featured</p>
              <h2 className="mt-3 font-display text-4xl">Popular products</h2>
            </div>
            <Link href="/products" className="text-sm text-terracotta">
              View all
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {delivered.length > 0 ? (
        <section className="mx-auto max-w-6xl px-5 py-20">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-terracotta">Delivered work</p>
              <h2 className="mt-3 font-display text-4xl">Sites we have completed</h2>
            </div>
            <Link href="/work" className="text-sm text-terracotta">
              View all
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {delivered.map((project) => (
              <Link key={project.id} href="/work" className="group border border-ink/10 bg-paper">
                <div className="aspect-[4/3] overflow-hidden bg-sand">
                  {project.image ? <ProductPhoto src={project.image} alt={project.title} /> : null}
                </div>
                <div className="p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-terracotta">
                    {[project.year, project.location].filter(Boolean).join(" · ") || "Delivered"}
                  </p>
                  <h3 className="mt-2 font-display text-2xl group-hover:text-terracotta">{project.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-terracotta">Why Super Precast</p>
          <h2 className="mt-3 font-display text-4xl">Durable products, practical pricing, reliable supply.</h2>
          <ul className="mt-8 space-y-5 text-sm leading-7 text-ink-soft">
            <li>Wide range of durable precast concrete products</li>
            <li>Focus on strength, design, and long-lasting performance</li>
            <li>Competitive pricing with timely delivery</li>
            <li>Customer-centric approach and consistent quality standards</li>
          </ul>
        </div>
        <div className="border border-ink/10 bg-paper p-8">
          <h3 className="font-display text-3xl">Send an enquiry</h3>
          <p className="mt-2 mb-6 text-sm text-ink-soft">
            Share quantity and location. We respond with availability and pricing.
          </p>
          <QuoteForm />
        </div>
      </section>
    </main>
  );
}
