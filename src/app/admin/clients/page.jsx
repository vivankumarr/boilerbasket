import StatCard from "@/components/StatCard";
import ClientsTable from "@/components/admin/ClientsTable";
import { fetchClients } from "./actions";
import { UsersIcon, UserCheckIcon, UserPlusIcon, RotateCwIcon } from "lucide-react";

const contentDiv = 'h-full p-2 overflow-scroll' // grid grid-rows-2'
// const cardDiv = 'bg-white m-4 p-2 text-center \
// 				border rounded-md'

const cardDiv = 'm-0 pt-4 pb-0 \
				flex flex-wrap \
				items-center \
				justify-evenly' // + ' bg-gray-100 border border-gray-400'

// https://preline.co/docs/tables.html

export default async function ClientsPage() {
	// Statistics from clients table
	const clients = await fetchClients();
	const totalClients = clients.length; // Total number of rows
	const activeClients = clients.filter(c => c.total_visits > 0).length; // Filtering to find active
	const newClients = clients.filter(c => c.total_visits === 1).length;
	const returnRate = totalClients > 0 ? Math.round((activeClients / totalClients) * 100) : 0; // active/total to get return rate
	
	console.log(clients);
	// TODO: Update total_visits, last_visit in clients (trigger?)
	// When check_out_time in appointments is set (non-NULL), increment count
	// When existing appointment associated with client_id deleted, decrement count

	return (
		<div className={`${contentDiv}`}>
			<div className={cardDiv}>
				<StatCard 
					title='Total Clients'
					value={totalClients}
					description='Since 2015'
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
					value={returnRate}
					description='Monthly Client Retention'
					descStyle='text-amber-600'
					icon={<RotateCwIcon />}
					iconBg={'bg-amber-100'}
				/>
			</div>

			<div className='px-4'>
				<ClientsTable initialClients={clients} />
			</div>
		</div>
	)
};

// export const metadata = {
// 	title: 'BoilerBasket | Clients',
// 	description: 'Manage client information and visit history'
// }