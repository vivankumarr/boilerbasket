'use server';

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function fetchBlockedDates() {
    const supabase = await createClient();
    const {data: dates, error} = await supabase
    .from("blocked_periods")
    .select("*")

    if (error) {
        console.log("Error in fetching blocked dates.");
        return;
    }
    return dates;
}

export async function addBlockedDate(data) {
    data.start = new Date(data.start).toLocaleString();
    data.end = new Date(data.end).toLocaleString();

    const supabase = await createClient();
    const {error } = await supabase
    .from("blocked_periods")
    .insert({start_date: data.start, end_date: data.end, reason: data.reason})


    if (error) {
        console.log("Error inserting data into blocked dates.")
    }
    console.log("Inserted blocked dates.")
    revalidatePath("admin/settings")
}

export async function deleteBlockedDate() {

}