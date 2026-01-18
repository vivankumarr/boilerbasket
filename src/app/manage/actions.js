"use server"

import { supabaseService } from "@/lib/supabase/service"
import { revalidatePath } from "next/cache";

export async function cancelAppointment(editToken) {
	const supabase = supabaseService;

	const { error } = await supabase
		.from("appointments")
		.update({ status: "Canceled" })
		.eq("edit_token", editToken);

	if (error) {
		return { success: false, error: `Error canceling appointment: ${error.message}` };
	}

	revalidatePath(`/manage/{editToken}`);
	return { success: true };
}

export async function rescheduleAppointment(editToken, newDateTime) {
	const supabase = supabaseService;

	const { data: slotRows, count, error: countError } = await supabase
		.from("appointments")
		.select("*", { count: "exact" })
    .eq("appointment_time", newDateTime)
    .neq("status", "Canceled"); // Canceled appointments not counted against limit

		const MAX_PER_SLOT = 5;
		const taken = typeof count === "number" ? count : (slotRows ? slotRows.length : 0);

		if (taken >= MAX_PER_SLOT) {
			return { success: false, error: "That time slot is now full." };
		}

		const { error } = await supabase
			.from("appointments")
			.update({ appointment_time: newDateTime, status: "Scheduled" })
			.eq("edit_token", editToken);

		if (error) {
			return { success: false, error: `Error rescheduling appointment: ${error.message}` };
		}

		revalidatePath(`/manage/{editToken}`);
		return { success: true };
}