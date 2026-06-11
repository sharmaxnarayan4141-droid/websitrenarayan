import { NextRequest, NextResponse } from "next/server";
import { createSession, setSessionCookie } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { password } = body;

  if (!password || typeof password !== "string") {
    return NextResponse.json({ error: "Password is required." }, { status: 400 });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || adminPassword === "change-me-in-production") {
    return NextResponse.json(
      { error: "Admin password not configured. Set ADMIN_PASSWORD in environment variables." },
      { status: 500 }
    );
  }

  if (password !== adminPassword) {
    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  }

  const token = createSession();
  const response = NextResponse.json({ success: true });
  setSessionCookie(response, token);

  return response;
}
