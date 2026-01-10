"use server";

import { createClient } from "@/lib/supabase/server";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

// Fetch data from the clients table
export async function fetchClients() {
	noStore();

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

export const deleteClient = async (clientId) => {
  const supabase = await createClient();

  const { error } = await supabase
	.from("clients")
	.delete()
	.eq("id", clientId);

	if (error) {
	console.error("Error deleting client:", error);
	return { success: false, error: error.message };
  }

  revalidatePath('admin/clients');
  return { success: true };
};

export const editClient = async (clientId, formData) => {
	const supabase = await createClient();

	const { data, error } = await supabase
    	.from("clients")
		.update({ 
			full_name: formData.full_name_new,
			email: formData.email_new,
			puid: formData.puid_new,
			role: formData.role_new
		})
		.eq("id", clientId)

	if (error) {
		console.error("Error editing client:", error);
		return { success: false, error: error.message };
	}
	
	revalidatePath('admin/clients');
	return { success: true, client: data };
};