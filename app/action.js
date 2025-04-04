"use server";
import { supabase } from "./services/supabase";

export const createToken = async (formData, address) =>
  await supabase.from("token").insert([
    {
      name: formData?.name,
      ticker: formData?.ticker,
      description: formData?.description,
      image: formData?.image,
      address,
      telegram: formData?.telegram,
      twitter: formData?.twitter,
      website: formData?.website,
      totalSupply: formData?.totalSupply,
      earthToken: formData?.earthToken,
      tokenSymbol: formData?.tokenSymbol,
    },
  ]);
