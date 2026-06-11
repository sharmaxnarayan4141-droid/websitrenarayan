import { clearSession } from "@/lib/admin-auth";

export async function POST() {
  return clearSession();
}
