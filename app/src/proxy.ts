import { auth } from "@/lib/auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return undefined;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/goals/:path*",
    "/categories/:path*",
    "/analytics/:path*",
    "/settings/:path*",
  ],
};
