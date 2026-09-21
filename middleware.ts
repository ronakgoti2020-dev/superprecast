import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const COOKIE = "sp_admin";
const IMAGE = /\.(jpe?g|png|webp|gif)$/i;
const SITE = "https://superprecastindia.com";

function secret() {
  return new TextEncoder().encode(
    process.env.AUTH_SECRET || "superprecast-dev-secret",
  );
}

function siteOrigin(request: NextRequest) {
  const host = (
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    ""
  )
    .split(",")[0]
    .trim();
  const proto = (request.headers.get("x-forwarded-proto") || "https").split(",")[0].trim();
  if (!host || host.includes("localhost") || host.includes("127.0.0.1")) {
    return SITE;
  }
  return `${proto}://${host}`;
}

function loginUrl(request: NextRequest) {
  return new URL("/admin/login", siteOrigin(request));
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(/\/$/, "") || "/";

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
    return NextResponse.redirect(loginUrl(request));
  }

  try {
    await jwtVerify(token, secret());
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(loginUrl(request));
  }
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/products/:path*", "/uploads/:path*"],
};
