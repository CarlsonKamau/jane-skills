// proxy.ts (Next.js 16+). On Next.js 13 to 15 name this file middleware.ts and
// export `middleware` instead of `proxy`; the body is identical.
//
// This redirects unauthenticated users away from admin URLs. It is a
// convenience layer, NOT the security boundary: a 2025 Next.js bug
// (CVE-2025-29927) let attackers skip middleware entirely. Every page and
// route handler that reads protected data must ALSO call requireUser() from
// lib/auth-guard.ts. Defence in depth, not either/or.

import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/admin", "/dashboard"];

async function isAuthenticated(req: NextRequest): Promise<boolean> {
  // Example for Supabase: check the auth cookie exists and is valid.
  // const supabase = createMiddlewareClient({ req, res });
  // const { data } = await supabase.auth.getUser();
  // return Boolean(data.user);
  return Boolean(req.cookies.get("session")?.value);
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const needsAuth = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!needsAuth) return NextResponse.next();

  if (!(await isAuthenticated(req))) {
    const login = new URL("/login", req.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
