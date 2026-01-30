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
    revalidatePath("admin/logistics")
}

export async function deleteBlockedDate(id) {
    if (!id) return;

    const supabase = await createClient();
    const res = await supabase
    .from("blocked_periods")
    .delete()
    .eq('id', id)
    revalidatePath("/admin/logistics")

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

    revalidatePath("admin/logistics")
    return {success: true}
}

export async function getCap() {
    const supabase = await createClient();
    const {data: cap, error} = await supabase
    .from("config")
    .select("value")
    .eq("key", "default_capacity");

    if (error) {
        return;
    }
    return cap;
}


export async function getVisible() {
    const supabase = await createClient();
    const {data: visibleDays, error} = await supabase
    .from("config")
    .select("value")
    .eq("key", "visible_pantry_days");

    if (error) {
        return;
    }
    return visibleDays;
}

export async function updateCap (newCap) {

    const supabase = await createClient();
    const {error } = await supabase
    .from("config")
    .update({value: Number(newCap)})
    .eq('key', 'default_capacity')

    revalidatePath("/admin/logistics")
    return {success: true}
}

export async function updateVisible (newVisible) {
    const supabase = await createClient();
    const { error } = await supabase
    .from("config")
    .update({value: newVisible})
    .eq('key', 'visible_pantry_days');

    revalidatePath("/admin/logistics")

    return {success: true}
}

//function IF we want specific time slot, not using for now
export async function validateTimeSlots(timeSlots, defaultCapacity) {
    const slots = timeSlots.map(s => ({
        slot_day: s.day,
        slot_date: s.date,
        start_ts: s.time.split(" ")[0],
        capacity: defaultCapacity[0].value,
        visible: true,
    }))

    const supabase = await createClient();
    const { error } = await supabase
    .from("time_slots")
    .upsert(slots, {
        onConflict: "slot_date,start_ts",
        ignoreDuplicates: true,
    })
}
