// lib/auth-guard.ts
// The real security boundary. Call at the top of every server component,
// server action, and route handler that touches protected data.
//
//   const user = await requireUser();            // redirects if missing
//   const user = await requireUser({ role: "admin" });
//
// Replace getSession() with your provider's server-side call. Never trust a
// value that came from the client (headers, cookies parsed by hand, props).

import { redirect } from "next/navigation";

type User = { id: string; role?: string };

async function getSession(): Promise<User | null> {
  // Supabase example:
  // const supabase = await createServerClient();
  // const { data: { user } } = await supabase.auth.getUser();
  // return user ? { id: user.id, role: user.app_metadata?.role } : null;
  return null;
}

export async function requireUser(opts?: { role?: string }): Promise<User> {
  const user = await getSession();
  if (!user) redirect("/login");
  if (opts?.role && user.role !== opts.role) redirect("/403");
  return user;
}
