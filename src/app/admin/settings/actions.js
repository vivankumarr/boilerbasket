"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function addBlockedPeriod(payload) {
  try {
    const { start_date, end_date, reason } = payload;

    if (!start_date || !end_date) {
      throw new Error("Start and end dates are required.");
    }

    const { error } = await supabase
      .from("blocked_periods")
      .insert([
        {
          start_date,
          end_date,
          reason,
          created_at: new Date().toISOString(),
        },
      ]);

    if (error) {
      throw error;
    }

    revalidatePath("/admin/settings");

    return { success: true };
  } catch (err) {
    console.error("Error adding blocked period:", err.message);
    return { success: false, error: err.message };
  }
}