import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { getSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";
import { formFiles, saveUpload } from "@/lib/upload";

export async function PUT(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const isMultipart = (request.headers.get("content-type") || "").includes("multipart/form-data");
  const body = isMultipart ? null : await request.json();
  const form = isMultipart ? await request.formData() : null;
  const value = (key: string) =>
    form ? String(form.get(key) || "") : String(body?.[key] || "");

  let logo = form ? String(form.get("logoUrl") || "") : String(body?.logoUrl || body?.logo || "");
  const uploaded = form ? formFiles(form, "logo")[0] : null;
  if (uploaded) {
    logo = await saveUpload(uploaded);
  }

  const data = {
    phone: value("phone"),
    email: value("email"),
    whatsapp: value("whatsapp"),
    address: value("address"),
    gst: value("gst"),
    owner: value("owner"),
    instagram: value("instagram"),
    mapUrl: value("mapUrl"),
    logo,
  };

  const settings = await prisma.setting.upsert({
    where: { id: "site" },
    update: data,
    create: { id: "site", ...data },
  });
  return NextResponse.json(settings);
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return NextResponse.json(await getSettings());
}
