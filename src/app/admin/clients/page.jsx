"use client";
import StatCard from "@/components/StatCard";
import { UsersIcon, UserCheckIcon, UserPlusIcon, RotateCwIcon, EditIcon, Trash2Icon } from "lucide-react";
// import AppointmentsTable from "@/components/admin/AppointmentsTable";

// importing supabase 
import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// importing react hooks (stores/fetch data)
import { useState, useEffect } from "react";

const contentDiv = 'h-full p-2 overflow-scroll' // grid grid-rows-2'
// const cardDiv = 'bg-white m-4 p-2 text-center \
// 				border rounded-md'

const cardDiv = 'm-0 pt-4 pb-0 \
				flex flex-wrap \
				items-center \
				justify-evenly' // + ' bg-gray-100 border border-gray-400'

// https://preline.co/docs/tables.html

const page = () => {
	const [clients, setClients] = useState([]); // holds the data from supabase
	
	useEffect(() => {
		const fetchClients = async () => {
			//fetching data from the clients table
			const {data, error} = await supabase
			.from("clients")
			.select("*");
			
			console.log("Supabase clients data:", data, "error:", error);
			setClients(data || []);
		};

		fetchClients();
	}, []);

	// stats from the clients data
	const totalClients = clients.length; //total rows
	const active = clients.filter(c => c.total_visits > 0).length; //Fliterting to find active
	const newClients = clients.filter(c => c.total_visits === 1).length;
	const returnRate = totalClients > 0 ? Math.round((active / totalClients) * 100) : 0; //active/total to get return rate

	//calculating status
	const getStatus = (client) => {
		if (client.total_visits > 1) return 'Active';
		if (client.total_visits === 1) return 'New';
		return 'Inactive';
	}

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
					value={active}
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
				{/* <AppointmentsTable initialAppointments={todaysAppointments} /> */}

				{/* TODO: Rework */}
				<div className='border border-transparent m-4'>
					<div className='col-span-full \
						bg-gray-300 m-4 gap-2 p-2 \
						border \
						grid grid-cols-4 justify-items-center'>
						<div>
							<label>Name</label>
							<input 
								className='w-full border bg-white'
								placeholder='Search clients...' 
							/>
						</div>
						<div>
							<label>Role</label>
							<div>
								<select className='border bg-white'>
									<option>All Roles</option>
									<option>Student</option>
									<option>Faculty</option>
									<option>Staff</option>
								</select>
							</div>
						</div>
						<div>
							<label>Last Visit</label>
							<div>
								<select className='border bg-white'>
									<option>All Time</option>
									<option>Past Week</option>
									<option>Past Month</option>
									<option>Past Year</option>
								</select>
							</div>
						</div>
					</div>

					<div className='col-span-full \
						bg-blue-0 m-4 \
						text-center'>
						{/* h-full */}
						<table className='w-full \
							border rounded-md \
							table-auto resize \
							divide-y'>
							<thead className='bg-gray-200'>
								<tr>
									<th>Client</th>
									<th>Role</th>
									<th>PUID</th>
									<th>Total Visits</th>
									<th>Last Visit</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody> 

								{clients.map((client) => (
									<tr key={client.id} className='border text-center'>
										<td>{client.full_name}</td>
										<td>{client.client_role}</td>
										<td>{client.puid}</td>
										<td>{client.total_visits}</td>
										<td>{client.last_visit}</td>

										<td
											className={
												client.total_visits > 1 
												? 'text-green-500 font-bold'
												: client.total_visits === 1 
												? 'text-blue-500 font-bold' 
												:'text-yellow-500 font-bold'
											}
											>
											{getStatus(client)}
										</td>
										<td className="flex gap-2 justify-center">
											<EditIcon />
											<Trash2Icon className="text-red-400" />
										</td>
									</tr>
								))}

							</tbody>
						</table>
					</div>
				</div>

			</div>
		</div>
	)
};

export default page;

// export const metadata = {
// 	title: 'BoilerBasket | Clients',
// 	description: 'Manage client information and visit history'
// }