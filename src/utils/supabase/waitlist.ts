// lib/waitlist.ts
"use server";

import { supabase } from "./client";

export async function addToWaitlist(email: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from("waitlist").insert([{ email }]);

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "You’re already on the list." };
    }
    return { success: false, error: error.message };
  }

  return { success: true };
}
