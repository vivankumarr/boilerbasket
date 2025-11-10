import { createClient } from '@/lib/supabase/server';
import { unstable_noStore as noStore } from 'next/cache';

// Fetches all appointments for the current day (in EST) and joins them with the info
// of the corresponding client
export async function getTodaysAppointments() {
    noStore();

    const supabase = await createClient();

    // Get the start and end of today in server's timezone (EST in Indiana)
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

    console.log(today, startOfDay, endOfDay);

    const { data, error } = await supabase
        .from('appointments')
        .select(`
            id,
            appointment_time,
            status,
            clients (
                full_name,
                puid,
                email,
                role
            )
        `)
        .gte('appointment_time', startOfDay)
        .lte('appointment_time', endOfDay)
        .order('appointment_time', { ascending: true });

    if (error) {
        console.error("Error fetching today's appointments:", error);
        return [];
    }



    return data;
}