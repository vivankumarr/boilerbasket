'use server'

//server imports
import { supabaseService } from "@/lib/supabase/service";

export async function confirmBooking(payload) {
    // fields from payload

    const { name: rawName, puid: rawPuid, email: rawEmail, role: rawRole, appointment_timestamp: appointmentTimestampRaw, force_update = false, proceed_without_update = false,} = payload || {};
    const name = rawName?.trim() || null;
    const puid = rawPuid ? String(rawPuid).trim() : null;
    const email = rawEmail ? String(rawEmail).trim().toLowerCase() : null;
    const role = rawRole?.trim() || null;
    const appointment_time = appointmentTimestampRaw ? String(appointmentTimestampRaw).trim() : null;

    // puid and appointment date and time are required fields

    if (!puid) {
        return { success: false, error: "PUID is required. Please provide your Purdue ID." };
    }
    if (!appointment_time) {
        return { success: false, error: "Appointment timestamp is required." };
    }

    const supabase = supabaseService;

    try {
        // find client by PUID
        const { data: existingClient, error: clientErr } = await supabase
            .from('clients')
            .select('*')
            .eq('puid', puid)
            .limit(1)
            .maybeSingle();

        if (clientErr) {
            return { success: false, error: `Error looking up client: ${clientErr.message}` };
        }

        // client exists in database
        if (existingClient) {
            // if the given data doesn't match the client, ask to confirm change
            const diffs = {};
            if (name && name !== (existingClient.full_name || "")) diffs.full_name = { existing: existingClient.full_name, incoming: name };
            if (email && email !== (existingClient.email || "").toLowerCase()) diffs.email = { existing: existingClient.email, incoming: email };
            if (role && role !== (existingClient.role || "")) diffs.role = { existing: existingClient.role, incoming: role };

            if (Object.keys(diffs).length > 0 && !force_update && !proceed_without_update) {
                return {
                    success: false,
                    conflict: true,
                    message: 'Is this you? We found an existing account for PUID ${puid} under the name "${existingClient.full_name || "Unknown"}".',
                    client: existingClient,
                    diffs,
                };
            }

            // if different input is confirmed, update client
            if (Object.keys(diffs).length > 0 && force_update ) {
                const updates = {};
                if (diffs.full_name) updates.full_name = name;
                if (diffs.email) updates.email = email;
                if (diffs.role) updates.role = role;

                const { data: updatedClient, error: updateErr } = await supabase
                .from("clients")
                .update(updates)
                .eq("puid", puid)
                .select("*")
                .single();

                if (updateErr) {
                    return { success: false, error: `Error updating client: ${updateErr.message}` };
                }
                existingClient.full_name = updatedClient.full_name;
                existingClient.email = updatedClient.email;
                existingClient.role = updatedClient.role;
            }
        }

        // new client
        let client = existingClient;
        if (!client) {
            const insertPayload = {
                puid,
                full_name: name || null,
                email: email || null,
                role: role || null,
            };

            const { data: newClient, error: insertErr } = await supabase
                .from("clients")
                .insert(insertPayload)
                .select("*")
                .single();

            if (insertErr) {
                return { success: false, error: `Error creating client: ${insertErr.message}` };
            }
            client = newClient;
        }

        const clientId = client.id;

        // prevent duplicate appointment
        const { data: existingSame, error: sameErr } = await supabase
            .from("appointments")
            .select("*")
            .eq("client_id", clientId)
            .eq("appointment_time", appointment_time)
            .limit(1)
            .maybeSingle();

        if (sameErr) { return { success: false, error: `Error checking existing appointment: ${sameErr.message}` }; }
        if (existingSame) { return { success: false, error: "You already have an appointment at that time." }; }

        // checks if max appointments per time slot has been reached
        const MAX_PER_SLOT = 5;
        const { data: slotRows, count, error: countErr } = await supabase
            .from("appointments")
            .select("*", { count: "exact" })
            .eq("appointment_time", appointment_time);

        if (countErr) { return { success: false, error: `Error checking slot availability: ${countErr.message}` }; }

        const taken = typeof count === "number" ? count : (slotRows ? slotRows.length : 0);
        if (taken >= MAX_PER_SLOT) {
            return { success: false, error: "Selected time slot is full. Please choose another time." };
        }

        // insert appointment into supabase table
        const apptPayload = {
            client_id: clientId,
            appointment_time,
        };

        const { data: insertedAppt, error: apptErr } = await supabase
            .from("appointments")
            .insert(apptPayload)
            .select("*")
            .single();

        if (apptErr) {
            return { success: false, error: `Error creating appointment: ${apptErr.message}` };
        }

        return {
            success: true,
            appointment: insertedAppt,
            client,
        };
    } catch (err) {
        return { success: false, error: `Unexpected error: ${err.message || err}` };
    }
}