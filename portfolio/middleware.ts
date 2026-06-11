import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const SESSION_COOKIE = "admin_session";

function verifyToken(token: string, secret: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const payload = parts[0];
  const signature = parts[1];
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  if (signature !== expected) return false;

  const [expiryStr] = payload.split(":");
  const expiry = parseInt(expiryStr, 10);
  if (isNaN(expiry) || Date.now() > expiry) return false;

  return true;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (except login page and API routes)
  if (pathname.startsWith("/admin")) {
    // Allow login page and admin API routes without session
    if (pathname === "/admin/login" || pathname.startsWith("/api/admin")) {
      return NextResponse.next();
    }

    const secret = process.env.ADMIN_PASSWORD ?? "change-me-in-production";
    const token = request.cookies.get(SESSION_COOKIE)?.value;

    if (!token || !verifyToken(token, secret)) {
      const loginUrl = new URL("/admin/login", request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(SESSION_COOKIE);
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
