import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const COOKIE = "sp_admin";
const IMAGE = /\.(jpe?g|png|webp|gif)$/i;

function secret() {
  return new TextEncoder().encode(
    process.env.AUTH_SECRET || "superprecast-dev-secret",
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (IMAGE.test(pathname) && (pathname.startsWith("/products/") || pathname.startsWith("/uploads/"))) {
    const folder = pathname.startsWith("/products/") ? "products" : "uploads";
    const name = pathname.slice(pathname.lastIndexOf("/") + 1);
    return NextResponse.rewrite(new URL(`/api/file/${folder}/${name}`, request.url));
  }

  if (!pathname.startsWith("/admin") || pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    await jwtVerify(token, secret());
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/products/:path*", "/uploads/:path*"],
};
