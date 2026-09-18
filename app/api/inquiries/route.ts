import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();
  const message = String(body.message || "").trim();
  if (!name || !phone || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const inquiry = await prisma.inquiry.create({
    data: {
      name,
      phone,
      email: body.email ? String(body.email) : null,
      city: body.city ? String(body.city) : null,
      message,
      productId: body.productId ? String(body.productId) : null,
    },
  });

  return NextResponse.json({ id: inquiry.id });
}
