import StatCard from "@/components/admin/StatCard";
import ClientsTable from "./ClientsTable";
import { fetchClients } from "./actions";
import { UsersIcon, UserCheckIcon, UserPlusIcon, RotateCwIcon } from "lucide-react";
import { checkAdminAccess } from "@/lib/supabase/checkAdmin";

const contentDiv = 'h-full overflow-scroll p-8' // grid grid-rows-2'
// const cardDiv = 'bg-white m-4 p-2 text-center \
// 				border rounded-md'

const cardDiv = 'm-0 pb-0 \
				flex \
				items-center \
				justify-center space-x-13 mb-8' // + ' bg-gray-100 border border-gray-400'

// https://preline.co/docs/tables.html

// TODO: Import option for appointments/clients tables (past data)?

export default async function ClientsPage() {
	
	//checks if we're admin or volunteer
	await checkAdminAccess();

	const today = new Date;
	const todayStr = today.toISOString();

	// Statistics from clients table
	const clients = await fetchClients();
	const totalClients = clients.length; // Total number of rows

	let minYear = new Date().getFullYear();
	for (let i = 0; i < clients.length; i++) {
		const year = clients[i].created_at.split("-")[0];
		minYear = Math.min(minYear, year);
	}

	// Confirmed clients with non-zero completed visits
	const visitedClients = clients.filter(c => c.total_visits > 0).length;

	const returningClientsMonth = clients.filter(
		(c) => 
			c.last_visit !== null && c.total_visits > 1
			&& c.last_visit.split("-")[0, 1] == todayStr.split("-")[0, 1]
	).length;

	// Active: Return visitor, visited within last month (fix later)
	const activeClients = clients.filter(
		(c) => 
			c.last_visit !== null && c.total_visits >= 1
			&& c.last_visit.split("-")[0, 1] == todayStr.split("-")[0, 1]
	).length;
	
	// New: Confirmed client created this month (because no first visit column)
	const newClients = clients.filter((c) => 
		// New this year
		c.created_at.split("-")[0] == todayStr.split("-")[0] && (todayStr.split("-")[1] == c.created_at.split("-")[1]) // 1
	).length;


	const returnRate = totalClients > 0 ? Math.round((returningClientsMonth / activeClients) * 100) : 0;

	return (
		<div className={`${contentDiv}`}>
			<div className={cardDiv}>
				<StatCard 
					title='Total Clients'
					value={totalClients}
					description={`Since ${minYear}`}
					descStyle='text-fuchsia-600'
					icon={<UsersIcon />}
					iconBg={'bg-fuchsia-100'}
				/>
				<StatCard 
					title='Active Clients'
					value={activeClients}
					description='Visited This Month'
					descStyle='text-green-600'
					icon={<UserCheckIcon />}
					iconBg={'bg-green-100'}
				/>
				<StatCard 
					title='New Clients'
					value={newClients}
					description='Onboarded This Month'
					descStyle='text-indigo-600'
					icon={<UserPlusIcon />}
					iconBg={'bg-indigo-100'}
				/>
				<StatCard 
					title='Return Rate'
					value={`${returnRate}` + "%"}
					description='Monthly Client Retention'
					descStyle='text-amber-600'
					icon={<RotateCwIcon />}
					iconBg={'bg-amber-100'}
				/>
			</div>

			<div className=''>
				<ClientsTable initialClients={clients} />
			</div>
		</div>
	)
};

export const metadata = {
  title: "Clients | BoilerBasket",
};