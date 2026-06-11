import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/admin-auth";
import { getAdminClient } from "@/lib/supabase-admin";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("site_sections")
      .select("*")
      .order("section_key", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ sections: data ?? [] });
  } catch (err) {
    console.error("List sections error:", err);
    return NextResponse.json({ error: "Failed to fetch sections." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { section_key: string; content: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { section_key, content } = body;

  if (!section_key || !content) {
    return NextResponse.json({ error: "section_key and content are required." }, { status: 400 });
  }

  try {
    const supabase = getAdminClient();

    // Upsert the section
    const { data, error } = await supabase
      .from("site_sections")
      .upsert(
        { section_key, content, updated_at: new Date().toISOString() },
        { onConflict: "section_key" }
      )
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ section: data });
  } catch (err) {
    console.error("Update section error:", err);
    return NextResponse.json({ error: "Failed to update section." }, { status: 500 });
  }
}
