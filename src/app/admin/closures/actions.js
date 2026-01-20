'use server';

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function fetchBlockedDates() {
    const supabase = await createClient();
    const {data: dates, error} = await supabase
    .from("blocked_periods")
    .select("*")

    if (error) {
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
    }
    revalidatePath("admin/closures")
}

export async function deleteBlockedDate(id) {
    if (!id) return;

    const supabase = await createClient();
    const res = await supabase
    .from("blocked_periods")
    .delete()
    .eq('id', id)
    revalidatePath("/admin/closures")

    return {success: true}
}

export async function editBlockedDate(start, end, reason, id) {
    if (!id || !start || !end) {
        return;
    }

    const supabase = await createClient();
    const { error } = await supabase
    .from("blocked_periods")
    .update({start_date: start, end_date: end, reason: reason})
    .eq('id', id);

    if (error) {
        return;
    }

    revalidatePath("admin/closures")
    return {success: true}
}