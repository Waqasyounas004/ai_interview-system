import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://bdqmgndozfvfghnmdxjm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_uQBcUoAi7gNEDhUyaM88iA_JXxBSLTf";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
