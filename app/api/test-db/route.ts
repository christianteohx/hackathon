import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/config";
import type { Database } from "@/types/database";

export async function GET() {
  try {
    const supabase = createClient<Database>(
      getSupabaseUrl(),
      getSupabaseAnonKey()
    );
    const { data, error } = await supabase.rpc("ping");

    if (error) {
      return NextResponse.json(
        { status: "error", error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ status: "ok", result: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { status: "error", error: message },
      { status: 500 }
    );
  }
}
