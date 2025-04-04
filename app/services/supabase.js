import { createClient } from "@supabase/supabase-js";
import env from "../constants/env";

const supabaseUrl = env.supabaseUrl;
const supabaseAnonKey = env.supabaseAnonKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey );

export const supabaseTable= {
    token: 'token',
    update:'update'
}