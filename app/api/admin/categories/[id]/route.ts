import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;

  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  });
  if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (category._count.products > 0) {
    return NextResponse.json(
      {
        error: `Move or delete ${category._count.products} product(s) in “${category.name}” first.`,
      },
      { status: 400 },
    );
  }

  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
