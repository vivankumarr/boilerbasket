'use server';

import { createClient } from "@/lib/supabase/server";

export async function getAllAppointments() {
    const supabase = await createClient();
    const {data: appointments, error} = await supabase
    .from('appointments')
    .select('*')

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


export async function getPredictions() {
    const supabase = await createClient();
    const {data: predictions, error} = await supabase
    .from('predictions')
    .select()

    if (error) {
        console.log("Error in getPredictions: ", error);
    }
    return predictions;
}