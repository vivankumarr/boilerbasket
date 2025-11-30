"use client";

// React hooks (store/fetch data)
import { useState, useEffect } from "react";
// import { createClient } from '@supabase/supabase-js'
import { EditIcon, Trash2Icon } from "lucide-react";

export default function ClientsTable({ initialClients = [] }) {
	const [clients, setClients] = useState(initialClients); // Holds table data

	useEffect(() => {
		setClients(initialClients);
	}, [initialClients]);

	// Calculate client status
	const getStatus = (client) => {
		if (client.total_visits > 1) return 'Active';
		if (client.total_visits === 1) return 'New';
		return 'Inactive';
	}

	// TODO: Implement pagination for table results (test with placeholder data)

	return (
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
							<th>Status</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody> 

						{clients.map((client) => (
							<tr key={client.id} className='border text-center'>
								<td>{client.full_name}</td>
								<td>{client.role}</td>
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
	);
}