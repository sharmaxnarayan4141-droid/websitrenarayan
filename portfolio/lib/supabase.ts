import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let publicClient: ReturnType<typeof createClient> | null = null;

export function getPublicClient() {
  if (publicClient) return publicClient;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a dummy client if not configured — components will handle gracefully
    publicClient = createClient(
      "https://placeholder.supabase.co",
      "placeholder-key"
    );
    return publicClient;
  }

  publicClient = createClient(supabaseUrl, supabaseAnonKey);
  return publicClient;
}
