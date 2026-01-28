'use server';

import { createClient } from "@/lib/supabase/server";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { startOfWeek, endOfWeek } from "date-fns"

// Fetches all appointments for the current day and joins them with the info
// of the corresponding client
export async function getTodaysAppointments() {
  noStore();
  const supabase = await createClient();
  const timeZone = 'America/Indiana/Indianapolis';

  // Get "now" in UTC, get Indiana date string to get start/end of day, then convert to UTC
  const now = new Date();
  const indianaDateString = now.toLocaleDateString('en-US', { timeZone });
  const startIndiana = new Date(`${indianaDateString} 00:00:00`);
  const endIndiana = new Date(`${indianaDateString} 23:59:59`);

  // Convert Indiana times to UTC for DB query
  const startUtc = fromZonedTime(startIndiana, timeZone).toISOString();
  const endUtc = fromZonedTime(endIndiana, timeZone).toISOString();

  const { data, error } = await supabase
    .from("appointments")
    .select(`
      id,
      appointment_time,
      status,
      clients (
          full_name,
          puid,
          email,
          role
      )`
    )
    .gte("appointment_time", startUtc)
    .lte("appointment_time", endUtc)
    .order("appointment_time", { ascending: true });

  if (error) {
    console.error("Error fetching today's appointments:", error);
    return [];
  }

  return data;
}

export async function getWeeklyAppointmentCount() {
  noStore();
  const supabase = await createClient();
  const timeZone = 'America/Indiana/Indianapolis';

  const now = new Date();
  const zonedNow = toZonedTime(now, timeZone);
    const startOfWeekIndiana = startOfWeek(zonedNow, { weekStartsOn: 1 });
  const endOfWeekIndiana = endOfWeek(zonedNow, { weekStartsOn: 1 });

  // Convert Indiana to UTC for DB
  const startUtc = fromZonedTime(startOfWeekIndiana, timeZone).toISOString();
  const endUtc = fromZonedTime(endOfWeekIndiana, timeZone).toISOString();

  const { count, error } = await supabase
    .from("appointments")
    .select("*", { count: 'exact', head: true })
    .gte("appointment_time", startUtc)
    .lte("appointment_time", endUtc);

  if (error) {
    console.error("Error fetching weekly count:", error);
    return 0;
  }

  return count || 0;
}

export const checkInClientServerAction = async ({ apptId }) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("appointments")
    .update({ status: "Checked-In", check_in_time: new Date().toISOString() })
    .eq("id", apptId)
    .select("*")
    .single();

  if (error) {
    console.error("Error checking in client:", error);
    return;
  }

  // Refresh the cache to display updated data without reloading page
  revalidatePath('admin/appointments');
  return data;
};

export const checkOutClientServerAction = async ({ apptId }) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("appointments")
    .update({ status: "Completed", check_out_time: new Date().toISOString() })
    .eq("id", apptId)
    .select("*")
    .single();

  if (error) {
    console.error("Error checking out client:", error);
    return;
  }

  revalidatePath('admin/appointments');
  return data;
};

export const editAppointment = async (apptId, formData) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("appointments")
    .update({ appointment_time: formData.appointment_timestamp })
    .eq("id", apptId)
    .select("*")
    .single();

  if (error) {
    console.error("Error editing appointment:", error);
    return { success: false, error: error.message };
  }

  revalidatePath('admin/appointments');
  return { success: true, appointment: data };
};

export const deleteAppointment = async (apptId) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("appointments")
    .delete()
    .eq("id", apptId);

    if (error) {
    console.error("Error deleting appointment:", error);
    return { success: false, error: error.message };
  }

  revalidatePath('admin/appointments');
  return { success: true };
};

export const cancelAppointmentServerAction = async ({ apptId }) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("appointments")
    .update({ status: "Canceled" })
    .eq("id", apptId)
    .select("*")
    .single();

    if (error) {
      console.error("Error canceling appointment:", error);
      return;
    }

    revalidatePath('admin/appointments');
    return data;
  }