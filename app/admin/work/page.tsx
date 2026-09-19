import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DeleteWorkButton } from "@/components/admin/DeleteWorkButton";
import { ProductPhoto } from "@/components/ProductPhoto";

export const dynamic = "force-dynamic";

export default async function AdminWorkPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">Our work</h1>
          <p className="mt-2 text-ink-soft">
            {projects.length} delivered projects shown on the website
          </p>
        </div>
        <Link href="/admin/work/new" className="bg-terracotta px-5 py-3 text-sm text-cream">
          Add work
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto border border-ink/10 bg-paper">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-sand text-ink-soft">
            <tr>
              <th className="px-4 py-3 font-medium">Photo</th>
              <th className="px-4 py-3 font-medium">Project</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Year</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-ink-soft">
                  No delivered work yet. Add a site they have completed.
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project.id} className="border-t border-ink/10">
                  <td className="px-4 py-3">
                    <div className="h-14 w-14 overflow-hidden border border-ink/10 bg-cream">
                      {project.image ? <ProductPhoto src={project.image} alt={project.title} /> : null}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {project.title}
                    {project.featured ? <span className="ml-2 text-xs text-terracotta">Homepage</span> : null}
                  </td>
                  <td className="px-4 py-3">{project.location || "—"}</td>
                  <td className="px-4 py-3">{project.year || "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/work/${project.id}`} className="mr-4">
                      Edit
                    </Link>
                    <DeleteWorkButton id={project.id} title={project.title} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
