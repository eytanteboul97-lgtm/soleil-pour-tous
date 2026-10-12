import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME, hashPassword } from "@/lib/admin-auth";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") return NextResponse.next();

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return NextResponse.redirect(new URL("/admin/login?missing=1", request.url));
  }

  const cookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const expectedToken = await hashPassword(expected);
  if (cookie !== expectedToken) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
