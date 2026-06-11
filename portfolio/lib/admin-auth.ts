import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";

const SESSION_COOKIE = "admin_session";
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

function getSecret(): string {
  return process.env.ADMIN_PASSWORD ?? "change-me-in-production";
}

function signToken(payload: string): string {
  const secret = getSecret();
  const hmac = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${hmac}`;
}

function verifyToken(token: string): string | null {
  const secret = getSecret();
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const payload = parts[0];
  const signature = parts[1];
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  if (signature !== expected) return null;

  // Check expiry embedded in payload
  const [expiryStr, createdStr] = payload.split(":");
  const expiry = parseInt(expiryStr, 10);
  if (isNaN(expiry) || Date.now() > expiry) return null;

  return createdStr || "true";
}

export function createSession(): string {
  const expiry = Date.now() + SESSION_DURATION_MS;
  return signToken(`${expiry}:${Date.now()}`);
}

export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function redirectToLogin(): NextResponse {
  const response = NextResponse.redirect(new URL("/admin/login", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
  response.cookies.delete(SESSION_COOKIE);
  return response;
}

export function clearSession(): NextResponse {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}

export function setSessionCookie(response: NextResponse, token: string): void {
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_MS / 1000,
  });
}
