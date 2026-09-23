import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  const { status } = await request.json();
  const inquiry = await prisma.inquiry.update({
    where: { id },
    data: { status: String(status || "new") },
  });
  return NextResponse.json(inquiry);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  await prisma.inquiry.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
