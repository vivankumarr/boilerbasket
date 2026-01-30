import StatCard from "@/components/admin/StatCard";
import ClientsTable from "./ClientsTable";
import { fetchClients } from "./actions";
import { UsersIcon, UserCheckIcon, UserPlusIcon, RotateCwIcon } from "lucide-react";
import { checkAdminAccess } from "@/lib/supabase/checkAdmin";
import { toZonedTime } from 'date-fns-tz';
import { isSameMonth, parseISO, parse } from 'date-fns';

const contentDiv = 'h-full overflow-scroll p-8'

const cardDiv = 'm-0 pb-0 \
			flex \
			items-center \
			justify-center space-x-13 mb-8'

// TODO: Import option for appointments/clients tables (past data)?

export default async function ClientsPage() {
	// checks if we're admin or volunteer
	await checkAdminAccess();

	// Get now in Indiana Time so stats don't flip at 7 PM EST
	const timeZone = 'America/Indiana/Indianapolis';
	const nowUtc = new Date();
	const nowInIndiana = toZonedTime(nowUtc, timeZone);

	// Stats from clients table
	const clients = await fetchClients();
	const totalClients = clients.length;

	let minYear = nowInIndiana.getFullYear();
	if (clients.length > 0) {
		const years = clients.map(c => new Date(c.created_at).getFullYear());
		minYear = Math.min(...years);
	}

	// Active clients: visited within the current month (checking year and month)
	const activeClients = clients.filter((c) => {
		if (!c.last_visit) return false;
		const visitDate = parse(c.last_visit, 'yyyy-MM-dd', new Date());
		return c.total_visits >= 1 && isSameMonth(visitDate, nowInIndiana);
	}).length;

	// Returning clients: active (visited this month) AND have > 1 total visits
	const returningClientsMonth = clients.filter((c) => {
			if (!c.last_visit) return false;
			const visitDate = parse(c.last_visit, 'yyyy-MM-dd', new Date());
			return c.total_visits > 1 && isSameMonth(visitDate, nowInIndiana);
	}).length;
	
	// New Clients: Created this month (checking year and month)
	const newClients = clients.filter((c) => {
		if (!c.created_at) return false;
		const createdDateUTC = parseISO(c.created_at);
		const createdDateIndiana = toZonedTime(createdDateUTC, timeZone);
		return isSameMonth(createdDateIndiana, nowInIndiana);
	}).length;

	const returnRate = activeClients > 0 ? Math.round((returningClientsMonth / activeClients) * 100) : 0;

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