"use client";

// React hooks (store/fetch data)
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon, PencilIcon, Trash2Icon } from "lucide-react";

import Edit from "@/app/admin/clients/Edit";
import DeleteForm from "./DeleteForm";
// import StatusBadge from "@/components/admin/AppointmentsTable"

// Helper component to style the status badge based on status
function StatusBadge({ status }) {
  let colors = "";
  switch (status) {
    case "Active":
      colors = "bg-green-100 text-green-800"; // Active
      break;
    case "Inactive":
      colors = "bg-yellow-100 text-yellow-800"; // Inactive
      break;
    case "New":
      colors = "bg-blue-100 text-blue-800"; // New
      break;
    default:
      colors = "bg-slate-100 text-slate-800";
  }
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colors}`}
    >
      {status}
    </span>
  );
}

const tableDataStyleMain = "px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900";
const tableDataStyle = "px-6 py-4 whitespace-nowrap text-sm text-slate-700";
const tableColStyle = "px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider";
const selectStyle = "font-normal w-full md:w-auto rounded-[6px] border-0 bg-slate-50 px-3 py-2 text-slate-900 h-1/2 h-1/2 \
						shadow-inner ring-1 ring-inset ring-slate-200 \
						focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-sm";

const today = new Date;
const todayStr = today.toISOString();
const thisYear = todayStr.split("-")[0];
const thisMonth = todayStr.split("-")[1];
const thisDay = todayStr.split("-")[2];

export default function ClientsTable({ initialClients = [] }) {
	const router = useRouter();

	const [clients, setClients] = useState(initialClients); // Holds table data
	const [searchQuery, setSearchQuery] = useState("");
	const [roleFilter, setRoleFilter] = useState("All Roles");
	const [visitFilter, setVisitFilter] = useState("All");
	
	const [editPopup, setEditPopup] = useState(false);
  	const [deletePopup, setDeletePopup] = useState(false);
	const [deleteData, setDeleteData] = useState(null);

	const [selectedData, setSelectedData] = useState(null);

	const handleEdit = (clientData) => {
		setSelectedData(clientData);
		setEditPopup(true);
	}

	useEffect(() => {
		setClients(initialClients);
	}, [initialClients]);

	// Callbacks passed to DeleteForm and EditForm components
	const onAppointmentDeleted = () => {
		setDeletePopup(false);
		router.refresh();
	}

	const onAppointmentEdited = () => {
		setEditPopup(false);
		router.refresh();
	}

	const handleEditPopup = (data) => {
		setEditData(data); // Pass the updated data to the EditForm component
		setEditPopup(true);
	};

	const handleDeletePopup = (data) => {
		setDeleteData(data);
		setDeletePopup(true);
	};

	// Filter clients based on state
	const filteredClients = clients
		// Filter based on client role
		.filter((client) => {
			switch (roleFilter) {
				case "All Roles":
					return true;
				case "Student":
					return client.role === "Student";
				case "Faculty":
					return client.role === "Faculty";
				case "Staff":
					return client.role === "Staff";
				default:
					return client.role === roleFilter;
			}
		})

		// Filter based on last client visit
		.filter((client) => {
			switch (visitFilter) { // Need to fix
				case "All Time":
					return true;
				case "Past Week":
					return (
						client.last_visit != null
						&& (new Date() - new Date(client.last_visit)) / (1000 * 60 * 60 * 24) <= 7
						// && (thisDay - client.last_visit.split("-")[2]) < 7
					)
				case "Past Month":
					return (
						client.last_visit != null
						&& (new Date() - new Date(client.last_visit)) / (1000 * 60 * 60 * 24 * 31) <= 1
						// && (thisDay - client.last_visit.split("-")[2]) < 7
					)
				case "Past Year":
					return (
						client.last_visit != null
						&& (new Date() - new Date(client.last_visit)) / (1000 * 60 * 60 * 24 * 365) <= 1
					)
				default:
					return true;
			}
		})

		.filter((client) => {
			// Filter by search query
			if (!searchQuery) return true;
			const clientName = client.full_name || "";
			return clientName.toLowerCase().includes(searchQuery.toLowerCase());
		});

	// Calculate client status
	const getStatus = (client) => {
		if (client.total_visits > 1) return 'Active';
		if (client.total_visits === 1) return 'New';
		return 'Inactive';
	}

	// TODO: Implement pagination for table results (test with placeholder data)

	return (
		<div className='bg-white shadow-lg rounded-md overflow-hidden'>

			{editPopup && <Edit isOpen={editPopup} changeOpen={setEditPopup} data={selectedData}/>}

			<DeleteForm 
				deletePopup={deletePopup}
				setDeletePopup={setDeletePopup}
				context="clients"
				apptId={deleteData?.id}
				onSuccess={onAppointmentDeleted}
			/>

			{/* Table */}
			<div className='overflow-x-auto'>
				{/* col-span-full bg-blue-0 m-4 text-center */}
				{/* h-full */}
				<table className='min-w-full divide-y divide-slate-200'>
					{/* w-full border rounded-md table-auto resize divide-y */}
					<thead>
						<tr>
							{/* Name */}
							<th
								scope="col"
                				className={tableColStyle}
							>
								<div className="relative w-full">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<SearchIcon className="h-5 w-5 text-slate-400" />
									</div>
									<input
										type="text"
										placeholder="Search clients..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="block w-full rounded-[6px] border-0 bg-slate-50 pl-10 py-2 text-slate-900
												shadow-inner ring-1 ring-inset ring-slate-200 placeholder:text-slate-400
												focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-sm"
									/>
								</div>
							</th>
							{/* Role */}
							<th
								scope="col"
                				className={tableColStyle}
							>
								<select
									value={roleFilter}
									onChange={(e) => setRoleFilter(e.target.value)}
									className={selectStyle}
								>
									<option>All Roles</option>
									<option>Student</option>
									<option>Faculty</option>
									<option>Staff</option>
								</select>
							</th>
							<th></th>
							<th></th>
							{/* Last Visit */}
							<th
								scope="col"
                				className={tableColStyle}
							>
								<select
									value={visitFilter}
									onChange={(e) => setVisitFilter(e.target.value)}
									className={selectStyle}
								>
									<option>All Time</option>
									<option>Past Week</option>
									<option>Past Month</option>
									<option>Past Year</option>
								</select>
							</th>
							<th></th>
							<th></th>
						</tr>
					</thead>
					<thead className='bg-slate-50'>
						<tr>
							<th
								scope="col"
                				className={tableColStyle}
							>Full Name</th>
							<th
								scope="col"
                				className={tableColStyle}
							>Role</th>
							<th
								scope="col"
                				className={tableColStyle}
							>PUID</th>
							<th
								scope="col"
                				className={tableColStyle}
							>Total Visits</th>
							<th
								scope="col"
                				className={tableColStyle}
							>Last Visit</th>
							<th
								scope="col"
                				className={tableColStyle}
							>Status</th>
							<th
								scope="col"
                				className={tableColStyle}
							>Actions</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-slate-200">
						{filteredClients.length > 0 ? (
							filteredClients.map((client) => (
								<tr key={client.id}>
									{/* className='border text-center' */}
									<td className={tableDataStyleMain}>
										<div className="text-sm font-medium text-slate-900">
                      						{client.full_name}
                    					</div>
                   						<div className="text-xs text-slate-500">
                      						{client.email}
                    					</div>
									</td>
									<td className={tableDataStyle}>{client.role}</td>
									<td className={tableDataStyle}>{client.puid}</td>
									<td className={tableDataStyle}>{client.total_visits}</td>
									<td className={tableDataStyle}>{client.last_visit}</td>
									<td className={tableDataStyle}>
										<StatusBadge status={getStatus(client)} />
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium \
										flex gap-2">
										{/* flex gap-2 justify-center */}
										<button
											onClick={() => handleEdit(client)}
											className="text-slate-500 hover:text-blue-600 transition"
											title="Edit Client"
										>
											<PencilIcon
												className="text-slate-500 hover:text-blue-600 transition cursor-pointer"
											/>
										</button>
										<button
											onClick={() => handleDeletePopup(client)}
											className="text-slate-500 hover:text-red-600 transition"
											title="Delete Client"
										>
											<Trash2Icon
												className="text-slate-500 hover:text-red-600 transition cursor-pointer"
											/>
										</button>
										
										
									</td>
								</tr>
							))
						) : (
							<tr>
								<td
									colSpan="6"
									className="px-6 py-10 text-center text-slate-500"
								>
								{
								// searchQuery 
								// || statusFilter !== "All"
								"No clients match your filters."
								}
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}