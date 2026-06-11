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
      .from("skills")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ skills: data ?? [] });
  } catch (err) {
    console.error("List skills error:", err);
    return NextResponse.json({ error: "Failed to fetch skills." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { name?: string; sort_order?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, sort_order } = body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "Skill name is required." }, { status: 400 });
  }

  try {
    const supabase = getAdminClient();

    // Get next sort_order if not provided
    let order = sort_order;
    if (typeof order !== "number") {
      const { data: maxSkill } = await supabase
        .from("skills")
        .select("sort_order")
        .order("sort_order", { ascending: false })
        .limit(1)
        .single();

      order = (maxSkill?.sort_order ?? 0) + 1;
    }

    const { data, error } = await supabase
      .from("skills")
      .insert({ name: name.trim(), sort_order: order })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ skill: data }, { status: 201 });
  } catch (err) {
    console.error("Create skill error:", err);
    return NextResponse.json({ error: "Failed to create skill." }, { status: 500 });
  }
}
