import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getSupabaseAnonKey, getSupabaseUrl } from "./config";

let browserClient: SupabaseClient<Database> | undefined;

export function createBrowserSupabaseClient() {
  if (!browserClient) {
    const supabaseUrl = getSupabaseUrl();
    const supabaseKey = getSupabaseAnonKey();
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase environment variables are not configured.");
    }
    browserClient = createBrowserClient<Database>(supabaseUrl, supabaseKey);
  }

  return browserClient;
}
