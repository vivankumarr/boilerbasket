"use server";

import { createClient } from "@/lib/supabase/server";

// Fetch data from the clients table
export async function fetchClients() {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("clients")
		.select("*", { count: "exact" });

	if (error) {
		console.error('Error fetching client data:', error)
		return [];
	}

	return data;
}