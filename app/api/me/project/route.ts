import { NextResponse } from "next/server";
import { getMyContext } from "@/lib/projects";

export async function GET() {
  try {
    const context = await getMyContext();

    if (!context) {
      return NextResponse.json(
        { error: "unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      membership: context.membership,
      profile: context.profile,
      project: context.project,
      user: context.authUser
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
