import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { WorkForm } from "@/components/admin/WorkForm";

export const dynamic = "force-dynamic";

export default async function EditWorkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
  if (!project) notFound();

  return (
    <div>
      <h1 className="mb-8 font-display text-4xl">Edit work</h1>
      <WorkForm project={project} />
    </div>
  );
}
