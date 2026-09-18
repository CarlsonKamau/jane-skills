import { createClient } from "@supabase/supabase-js";
// Hardcoded during a late-night session. Demo values only, not real credentials.
export const supabase = createClient(
  "https://abcdefgh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.FAKE_HARDCODED_PAYLOAD_FOR_DEMO_00000000"
);
