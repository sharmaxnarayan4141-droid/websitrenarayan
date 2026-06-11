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
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ projects: data ?? [] });
  } catch (err) {
    console.error("List projects error:", err);
    return NextResponse.json({ error: "Failed to fetch projects." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { name?: string; description?: string; stack?: string[]; url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, description, stack, url } = body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "Project name is required." }, { status: 400 });
  }

  try {
    const supabase = getAdminClient();

    // Get next sort_order
    const { data: maxProject } = await supabase
      .from("projects")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .single();

    const nextOrder = (maxProject?.sort_order ?? 0) + 1;

    const { data, error } = await supabase
      .from("projects")
      .insert({
        name: name.trim(),
        description: description?.trim() ?? "",
        stack: stack ?? [],
        url: url?.trim() || null,
        sort_order: nextOrder,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ project: data }, { status: 201 });
  } catch (err) {
    console.error("Create project error:", err);
    return NextResponse.json({ error: "Failed to create project." }, { status: 500 });
  }
}
