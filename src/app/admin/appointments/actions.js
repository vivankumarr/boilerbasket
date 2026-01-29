'use server';

import { createClient } from "@/lib/supabase/server";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

export async function getAllAppointments() {
  const supabase = await createClient();

  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  

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
    .gte("appointment_time", monday.toISOString())
    .order("appointment_time", { ascending: true });
    if (error) return [];
    return data;
}

// Fetches all appointments for the current day (in EST) and joins them with the info
// of the corresponding client
export async function getTodaysAppointments() {
  noStore();

  const supabase = await createClient();

  // Get the start and end of today in server's timezone (EST in Indiana)
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
  const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString()

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
    .gte("appointment_time", startOfDay)
    .lte("appointment_time", endOfDay)
    .order("appointment_time", { ascending: true });

  if (error) {
    console.error("Error fetching today's appointments:", error);
    return [];
  }

  return data;
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