import { NextResponse } from "next/server";
import { getSession } from "@/lib/admin-auth";
import { getAdminClient } from "@/lib/supabase-admin";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getAdminClient();

    const [messagesRes, unreadRes, skillsRes, projectsRes] = await Promise.all([
      supabase.from("contact_messages").select("*", { count: "exact", head: true }),
      supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("read", false),
      supabase.from("skills").select("*", { count: "exact", head: true }),
      supabase.from("projects").select("*", { count: "exact", head: true }),
    ]);

    return NextResponse.json({
      totalMessages: messagesRes.count ?? 0,
      unreadMessages: unreadRes.count ?? 0,
      totalSkills: skillsRes.count ?? 0,
      totalProjects: projectsRes.count ?? 0,
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    return NextResponse.json({ error: "Failed to fetch stats." }, { status: 500 });
  }
}
