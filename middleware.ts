import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { getOrganizationByCustomDomain } from "@/lib/organizations";

export async function middleware(request: NextRequest) {
  const hostname = request.nextUrl.hostname;
  const organization = getOrganizationByCustomDomain(hostname);

  if (organization) {
    const url = request.nextUrl.clone();
    url.searchParams.set("orgId", organization.id);
    return NextResponse.rewrite(url);
  }

  return updateSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
