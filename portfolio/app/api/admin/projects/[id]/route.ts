import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/admin-auth";
import { getAdminClient } from "@/lib/supabase-admin";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: {
    name?: string;
    description?: string;
    stack?: string[];
    url?: string | null;
    sort_order?: number;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.name !== undefined) {
    if (typeof body.name !== "string" || body.name.trim().length === 0) {
      return NextResponse.json({ error: "Invalid project name." }, { status: 400 });
    }
    updates.name = body.name.trim();
  }
  if (body.description !== undefined) {
    updates.description = body.description;
  }
  if (body.stack !== undefined) {
    updates.stack = body.stack;
  }
  if (body.url !== undefined) {
    updates.url = body.url;
  }
  if (body.sort_order !== undefined) {
    updates.sort_order = body.sort_order;
  }

  if (Object.keys(updates).length <= 1) {
    return NextResponse.json({ error: "No valid fields to update." }, { status: 400 });
  }

  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("projects")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ project: data });
  } catch (err) {
    console.error("Update project error:", err);
    return NextResponse.json({ error: "Failed to update project." }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const supabase = getAdminClient();
    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete project error:", err);
    return NextResponse.json({ error: "Failed to delete project." }, { status: 500 });
  }
}
