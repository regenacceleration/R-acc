"use server";
import { supabase, supabaseTable } from "./services/supabase";

export const createToken = async (formData) =>
  await supabase.from(supabaseTable.token).insert([formData]);
