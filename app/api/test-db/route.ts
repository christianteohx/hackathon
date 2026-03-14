import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getSupabaseClient();
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
