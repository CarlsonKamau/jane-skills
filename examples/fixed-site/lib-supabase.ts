import { createClient } from "@supabase/supabase-js";
// Browser-safe client: anon key only. RLS policies do the real gatekeeping.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
