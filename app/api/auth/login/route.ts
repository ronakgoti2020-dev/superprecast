import { NextResponse } from "next/server";
import { createSession, verifyAdmin } from "@/lib/auth";

export async function POST(request: Request) {
  const { username, password } = await request.json();
  if (!username || !password) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
  }
  const ok = await verifyAdmin(String(username), String(password));
  if (!ok) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }
  await createSession(String(username));
  return NextResponse.json({ ok: true });
}
