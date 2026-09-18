import { supabase } from "../../../lib-supabase";

export async function POST(req: Request) {
  const body = await req.json();
  await supabase.from("messages").insert(body);
  return Response.json({ ok: true });
}
