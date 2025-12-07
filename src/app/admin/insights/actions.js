'use server';

import { createClient } from "@/lib/supabase/server";


export async function getAllAppointments() {
    const supabase = await createClient();
    const {data: appointments, error} = await supabase
    .from('appointments')
    .select()
    .eq('status', 'Completed');

    if (error) {
        console.log("ERROR in getAllAppointments: ", error);
        return;
    }
    else {
        return appointments;
    }
}

export async function getLastYearAppts() {
    const supabase = await createClient();

    let year_ago = new Date();
    
    year_ago.setFullYear(year_ago.getFullYear() - 1);
    year_ago = year_ago.toISOString();


    const {data: appointments, error} = await supabase
    .from('appointments')
    .select()
    .eq('status', 'Completed')
    .gte('appointment_time', year_ago);

    if (error) {
        console.log("ERROR in getLastYearAppts: ", error);
        return;
    }
    else {
        return appointments;
    }
}

export async function getAllClients() {
    const supabase = await createClient();
    const {data: clients, error} = await supabase
    .from('clients')
    .select()

    if (error) {
        console.log("ERROR in getAllClients: ", error);
        return;
    }
    else {
        return clients;
    }
}