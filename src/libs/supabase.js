import { SUPABASE_KEY, SUPABASE_URL } from "@/config";
import { createClient } from "@supabase/supabase-js";

export const db = createClient(SUPABASE_URL, SUPABASE_KEY);