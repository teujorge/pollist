import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

let supabase: ReturnType<typeof createClient<Database>> | undefined;

try {
  supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
} catch (error) {
  console.error("Error connecting to Supabase", error);
}

export { supabase };
