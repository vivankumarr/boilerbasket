'use server'

//server imports
import { supabaseService } from "@/lib/supabase/service";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function confirmBooking(payload) {
    // fields from payload

    const { name: rawName, puid: rawPuid, email: rawEmail, role: rawRole, appointment_timestamp: appointmentTimestampRaw, force_update = false, proceed_without_update = false,} = payload || {};
    const name = rawName?.trim() || null;
    const puid = rawPuid ? String(rawPuid).trim() : null;
    const email = rawEmail ? String(rawEmail).trim().toLowerCase() : null;
    const role = rawRole?.trim() || null;
    const appointment_time = appointmentTimestampRaw ? String(appointmentTimestampRaw).trim() : null;

    if (!role) {
        return { success: false, error: "Please select a role." }
    }
    if (!email) {
        return { success: false, error: "Email address is required." }
    }
    if (!puid) {
        return { success: false, error: "PUID is required." };
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
				// if (full_name == null || email == null || role == null)
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

        // Magic link for appointment management
        const manageLink = `${process.env.NEXT_PUBLIC_BASE_URL}/manage/${insertedAppt.edit_token}`

        // Send confirmation email via Resend
        try {
            const dateObj = new Date(appointment_time);
            const dateStr = dateObj.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
            });
            const timeStr = dateObj.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                timeZone: "America/Indiana/Indianapolis"
            });

            await resend.emails.send({
                            from: "BoilerBasket <appointments@boilerbasket.com>",
                            to: email,
                            subject: "Appointment Confirmed: ACE Campus Food Pantry",
                            html: `
                                <!DOCTYPE html>
                                <html>
                                <head>
                                    <meta charset="utf-8">
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                    <title>Appointment Confirmation</title>
                                    <style>
                                        body { margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
                                        
                                        .container { 
                                            max-width: 600px; 
                                            margin: 40px auto; /* Added top margin for visual separation */
                                            background-color: #ffffff; 
                                            border-radius: 12px; 
                                            overflow: hidden; 
                                            border: 1px solid #e2e8f0; /* Subtle border definition */
                                            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); 
                                        }
                                        
                                        .header { background-color: #FEFBCC; padding: 30px 20px; text-align: center; }
                                        .gradient-bar { height: 6px; background: linear-gradient(90deg, #FCD34D 0%, #A78BFA 100%); width: 100%; }
                                        .content { padding: 40px 30px; color: #334155; line-height: 1.6; }
                                        
                                        .h1 { font-size: 24px; font-weight: 700; color: #1e293b; margin-top: 0; margin-bottom: 10px; }
                                        .intro { font-size: 16px; margin-bottom: 30px; color: #475569; }
                                        
                                        /* The Details Card (Ticket-Style) */
                                        .details-card {
                                            background-color: #FFFBEB;
                                            border: 1px solid #FCD34D;
                                            border-left: 6px solid #4C1D95;
                                            border-radius: 8px;
                                            margin-bottom: 30px;
                                            width: 100%;
                                            border-spacing: 0;
                                            border-collapse: separate;
                                        }
                                        
                                        .label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; font-weight: 600; vertical-align: top; padding-top: 4px; width: 30%; }
                                        .value { font-size: 16px; font-weight: 700; color: #1e293b; text-align: right; vertical-align: top; width: 70%; }
                                        .row-cell { padding: 12px 25px; border-bottom: 1px dashed #cbd5e1; }
                                        .last-cell { border-bottom: none; }

                                        .footer { background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
                                        .btn { display: inline-block; background-color: #4C1D95; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; margin-top: 10px; }
                                        
                                        @media only screen and (max-width: 600px) {
                                            .content { padding: 20px; }
                                            .row-cell { padding: 12px 15px; }
                                            .container { width: 100% !important; border-radius: 0; margin: 0; }
                                        }
                                    </style>
                                </head>
                                <body>
                                    <div style="background-color: #f8fafc; padding: 20px; min-height: 100vh;">
                                        <div class="container">
                                            
                                            <div class="header">
                                                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                                    <tr>
                                                        <td align="center">
                                                            <img src="https://i.ibb.co/sk7QQD8/boilerbasket-logo.png" alt="ACE Campus Food Pantry Logo" width="50" style="display: inline-block; vertical-align: middle; margin-right: 10px;">
                                                            <span style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 32px; font-weight: 700; color: #000000; letter-spacing: -0.5px; line-height: 1; vertical-align: middle;">
                                                                BoilerBasket
                                                            </span>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
                                            
                                            <div class="gradient-bar"></div>

                                            <div class="content">
                                                <h1 class="h1">You're all set, ${name}!</h1>
                                                <p class="intro">
                                                    Your visit to the <strong>ACE Campus Food Pantry</strong> has been successfully scheduled. We look forward to seeing you.
                                                </p>

                                                <table class="details-card" cellpadding="0" cellspacing="0">
                                                    <tr>
                                                        <td class="row-cell">
                                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                                <tr>
                                                                    <td class="label" align="left">DATE</td>
                                                                    <td class="value" align="right">${dateStr}</td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="row-cell">
                                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                                <tr>
                                                                    <td class="label" align="left">TIME</td>
                                                                    <td class="value" align="right">${timeStr}</td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="row-cell">
                                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                                <tr>
                                                                    <td class="label" align="left">LOCATION</td>
                                                                    <td class="value" align="right">
                                                                        <div>ACE Campus Food Pantry</div>
                                                                        <div style="font-size: 13px; font-weight: normal; color: #64748b; margin-top: 4px; line-height: 1.4;">
                                                                            200 N Russell St<br>
                                                                            West Lafayette, IN<br>
                                                                            <span style="font-style: italic;">(Upstairs of Student Baptist Foundation)</span>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="row-cell last-cell">
                                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                                <tr>
                                                                    <td class="label" align="left">PUID</td>
                                                                    <td class="value" align="right">${puid}</td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>

                                                <p style="font-size: 14px; color: #64748b; margin-bottom: 20px; line-height: 1.6;">
                                                    <strong>Reminders:</strong><br>
                                                    • Please bring your PUID.<br>
                                                    • Please arrive during your time slot.<br>
                                                </p>

                                                <div style="text-align: center; margin: 30px 0;"> 
                                                    <p style="margin-bottom: 10px; color: #64748b;">Need to cancel or reschedule?</p> 
                                                    <a href="${manageLink}" style="background-color: #ffffff; color: #4C1D95; border: 2px solid #4C1D95; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;"> Manage Appointment 
                                                    </a> 
                                                </div>

                                                <div style="text-align: center; margin-top: 30px;">
                                                    <a href="https://acefoodpantry.wixsite.com/website" class="btn" style="color: #ffffff;">Visit Website</a>
                                                </div>
                                            </div>

                                            <div class="footer">
                                                <p><strong>BoilerBasket</strong> by ACE Campus Food Pantry</p>
                                                <p>Purdue University • West Lafayette, IN</p>
                                            </div>
                                        </div>
                                    </div>
                                </body>
                                </html>
                            `,
                        });
        } catch (emailError) {
            console.error("Database success, but email failed:", emailError);
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