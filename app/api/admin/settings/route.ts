import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { getSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = await request.json();
  const settings = await prisma.setting.upsert({
    where: { id: "site" },
    update: {
      phone: String(body.phone || ""),
      email: String(body.email || ""),
      whatsapp: String(body.whatsapp || ""),
      address: String(body.address || ""),
      gst: String(body.gst || ""),
      owner: String(body.owner || ""),
    },
    create: {
      id: "site",
      phone: String(body.phone || ""),
      email: String(body.email || ""),
      whatsapp: String(body.whatsapp || ""),
      address: String(body.address || ""),
      gst: String(body.gst || ""),
      owner: String(body.owner || ""),
    },
  });
  return NextResponse.json(settings);
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return NextResponse.json(await getSettings());
}
