import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/admin-auth";
import { getAdminClient } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = parseInt(searchParams.get("limit") ?? "20", 10);
  const offset = (page - 1) * limit;
  const readFilter = searchParams.get("read"); // "true", "false", or null

  try {
    const supabase = getAdminClient();

    let query = supabase
      .from("contact_messages")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (readFilter === "true") {
      query = query.eq("read", true);
    } else if (readFilter === "false") {
      query = query.eq("read", false);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      messages: data ?? [],
      total: count ?? 0,
      page,
      limit,
      totalPages: Math.ceil((count ?? 0) / limit),
    });
  } catch (err) {
    console.error("List messages error:", err);
    return NextResponse.json({ error: "Failed to fetch messages." }, { status: 500 });
  }
}
