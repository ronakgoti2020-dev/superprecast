import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductPhoto } from "@/components/ProductPhoto";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Completed projects",
  description:
    "Photo gallery of sites Super Precast India has delivered — not the company homepage.",
  alternates: { canonical: "https://superprecastindia.com/work" },
};

export default async function WorkPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });

  return (
    <main className="mx-auto max-w-6xl px-5 py-16">
      <p className="text-xs uppercase tracking-[0.28em] text-terracotta">Delivered work</p>
      <h1 className="mt-3 font-display text-5xl">Sites we have completed</h1>
      <p className="mt-4 max-w-2xl text-ink-soft">
        A record of precast work Super Precast has supplied and installed for homes,
        landscapes, and commercial sites.
      </p>

      {projects.length === 0 ? (
        <p className="mt-12 text-ink-soft">Completed work will appear here soon.</p>
      ) : (
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const photos = project.images.length
              ? project.images.map((item) => item.url)
              : project.image
                ? [project.image]
                : [];
            return (
              <article key={project.id} className="border border-ink/10 bg-paper">
                <div className="aspect-[4/3] overflow-hidden bg-sand">
                  {photos[0] ? <ProductPhoto src={photos[0]} alt={project.title} /> : null}
                </div>
                <div className="p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-terracotta">
                    {[project.year, project.location].filter(Boolean).join(" · ") || "Delivered"}
                  </p>
                  <h2 className="mt-2 font-display text-2xl">{project.title}</h2>
                  {project.description ? (
                    <p className="mt-3 text-sm leading-7 text-ink-soft">{project.description}</p>
                  ) : null}
                  {photos.length > 1 ? (
                    <div className="mt-4 grid grid-cols-4 gap-2">
                      {photos.slice(1, 5).map((src) => (
                        <div key={src} className="aspect-square overflow-hidden border border-ink/10">
                          <ProductPhoto src={src} alt="" />
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
