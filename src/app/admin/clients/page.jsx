import StatCard from "@/components/StatCard";
import { UsersIcon, UserCheckIcon, UserPlusIcon, RotateCwIcon, EditIcon, Trash2Icon } from "lucide-react";
// import AppointmentsTable from "@/components/admin/AppointmentsTable";

const contentDiv = 'h-full p-2 overflow-scroll' // grid grid-rows-2'
// const cardDiv = 'bg-white m-4 p-2 text-center \
// 				border rounded-md'

const cardDiv = 'm-0 pt-4 pb-0 \
				flex flex-wrap \
				items-center \
				justify-evenly' // + ' bg-gray-100 border border-gray-400'

// https://preline.co/docs/tables.html

const page = () => {
	return (
		<div className={`${contentDiv}`}>
			<div className={cardDiv}>
				<StatCard 
					title='Total Clients'
					value='1,247'
					description='Since 2015'
					descStyle='text-fuchsia-600'
					icon={<UsersIcon />}
					iconBg={'bg-fuchsia-100'}
				/>
				<StatCard 
					title='Active Clients'
					value='892'
					description='Visited This Month'
					descStyle='text-green-600'
					icon={<UserCheckIcon />}
					iconBg={'bg-green-100'}
				/>
				<StatCard 
					title='New Clients'
					value='156'
					description='Onboarded This Month'
					descStyle='text-indigo-600'
					icon={<UserPlusIcon />}
					iconBg={'bg-indigo-100'}
				/>
				<StatCard 
					title='Return Rate'
					value='78%'
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
							<label>Status</label>
							<div>
								<select className='border bg-white'>
									<option>All Statuses</option>
									<option>New</option>
									<option>Active</option>
									<option>Inactive</option>
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
								<tr className='border'>
									<td>First Last</td>
									<td>Student</td>
									<td>00****-0123</td>
									<td>1</td>
									<td>2025-10-28</td>
									<td className='text-blue-500 font-bold'>New</td>
									<td className='flex gap-2 justify-center'>
										<EditIcon />
										<Trash2Icon className='text-red-400' />
									</td>
								</tr>
								<tr className='border'>
									<td>First Last</td>
									<td>Staff</td>
									<td>00****-4567</td>
									<td>5</td>
									<td>2024-09-23</td>
									<td className='text-yellow-500 font-bold'>Inactive</td>
									<td className='flex gap-2 justify-center'>
										<EditIcon />
										<Trash2Icon className='text-red-400' />
									</td>
								</tr>
								<tr className='border'>
									<td>First Last</td>
									<td>Faculty</td>
									<td>00****-6789</td>
									<td>7</td>
									<td>2025-10-22</td>
									<td className='text-green-500 font-bold'>Active</td>
									<td className='flex gap-2 justify-center'>
										<EditIcon />
										<Trash2Icon className='text-red-400' />
									</td>
								</tr>
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