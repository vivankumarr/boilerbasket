'use server';

import { createClient } from "@/lib/supabase/server";

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
    console.error("Error checking in client:", error);
    return;
  }

  return data;
};

export const editAppointment = async (apptId, formData) => {
  const supabase = await createClient();

  // console.log("Formdata", formData);

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

  return { success: true, appointment: data };
};
