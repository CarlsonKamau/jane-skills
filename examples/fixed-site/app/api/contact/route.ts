import { supabase } from "../../../lib-supabase";

const MAX = 2000;
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim().slice(0, 120) : "";
  const email = typeof body?.email === "string" ? body.email.trim().slice(0, 254) : "";
  const message = typeof body?.message === "string" ? body.message.trim().slice(0, MAX) : "";
  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !message) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }
  if (body?.website) return Response.json({ ok: true }); // honeypot
  // TODO: verify Turnstile token and rate limit by IP before insert
  await supabase.from("messages").insert({ name, email, message });
  return Response.json({ ok: true });
}
