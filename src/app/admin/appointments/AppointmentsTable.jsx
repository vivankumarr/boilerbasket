"use client";

import { useEffect, useState } from "react";
import { Search, Pencil, Trash2, CircleX } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePopup } from "@/components/admin/ScheduleAppointmentPopupContext";
import Form from "./Form";
import EditForm from "@/components/admin/EditForm";
import DeleteForm from "@/components/admin/DeleteForm";
import { getUserRole } from "@/lib/supabase/checkAdmin";

// Helper function to format time (e.g., "1:30 PM")
function formatTime(timestamp) {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

// Helper component to style the status badge based on status
function StatusBadge({ status }) {
  let colors = "";
  switch (status) {
    case "Scheduled":
      colors = "bg-yellow-100 text-yellow-800"; // Scheduled
      break;
    case "Checked-In":
      colors = "bg-blue-100 text-blue-800"; // Checked-In
      break;
    case "Completed":
      colors = "bg-green-100 text-green-800"; // Completed
      break;
    case "Canceled":
      colors = "bg-red-100 text-red-800"; // Canceled
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

// Helper function to mask the first 5 digits of the PUID
export function maskPUID(puid) {
  if (!puid) return "";
  const puidStr = String(puid);
  return "••••" + puidStr.slice(-4);
}

export default function AppointmentsTable({ initialAppointments = [], checkInClient, checkOutClient, cancelAppointment, timeSlots = []}) {
  const router = useRouter();

  const [appointments, setAppointments] = useState(initialAppointments);
  const { showPopup, setShowPopup } = usePopup();
  const [editPopup, setEditPopup] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [role, setRole] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchRole() {
			const role = await getUserRole();
			setRole(role);
			setIsLoading(false);
		}
		fetchRole();
	}, [])

  // Sync state when initialAppointments prop updates (after router.refresh)
  useEffect(() => {
    setAppointments(initialAppointments);
  }, [initialAppointments]);

  // Handler functions for immediate UI updates
  const handleCheckIn = async (apptId) => {
    setAppointments((prev) =>
      prev.map(appointment => appointment.id === apptId ? { ...appointment, status: "Checked-In" } : a)
    );

    await checkInClient({ apptId });
    router.refresh();
  };

  const handleCheckOut = async (apptId) => {
    setAppointments((prev) =>
      prev.map(appointment => appointment.id === apptId ? { ...appointment, status: "Completed" } : a)
    );

    await checkOutClient({ apptId });
    router.refresh();
  }

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
    setEditData(data); // Pass the appointment data to the EditForm component
    setEditPopup(true);
  };

  const handleDeletePopup = (data) => {
    setDeleteData(data);
    setDeletePopup(true);
  };

  // Filter the appointments based on state
  const filteredAppointments = appointments
    .filter((appt) => {
      // Filter based on status
      if (statusFilter === "All") return true;
      if (statusFilter === "Checked-In") return appt.status === "Checked-In";
      return appt.status === statusFilter;
    })
    .filter((appt) => {
      // Filter by search query
      if (!searchQuery) return true;
      const clientName = appt.clients?.full_name || "";
      return clientName.toLowerCase().includes(searchQuery.toLowerCase());
    });

  return (
    <div className="bg-white shadow-lg rounded-md overflow-hidden">
      <Form showPopup={showPopup} setShowPopup={setShowPopup} onSuccess={() => router.refresh()} />

      {/* Search and filter section */}

      <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-white border-t border-b border-slate-200 space-y-3 md:space-y-0">
        {/* Search bar */}
        <div className="relative w-full md:w-1/3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search by client name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-[6px] border-0 bg-slate-50 pl-10 py-2 text-slate-900
                       shadow-inner ring-1 ring-inset ring-slate-200 placeholder:text-slate-400
                       focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-sm"
          />
        </div>

        {/* Status filter */}
        <div className="w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-auto rounded-[6px] border-0 bg-slate-50 px-3 py-2 text-slate-900
                       shadow-inner ring-1 ring-inset ring-slate-200
                       focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-sm"
          >
            <option value="All">All</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Checked-In">Checked-In</option>
            <option value="Completed">Completed</option>
            <option value="Canceled">Canceled</option>
          </select>
        </div>
      </div>

      {/* Popup Forms */}
      <EditForm
        apptId={editData?.id}
        previousData={editData?.clients}
        currentTimestamp={editData?.appointment_time}
        showPopup={editPopup}
        setShowPopup={setEditPopup}
        timeSlots={timeSlots}
        onSuccess={onAppointmentEdited}
      />

      <DeleteForm 
        deletePopup={deletePopup}
        setDeletePopup={setDeletePopup}
        apptId={deleteData?.id}
        onSuccess={onAppointmentDeleted}
        context={"appointment"}
      />

      {/* Today's appointments table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
              >
                Time
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
              >
                PUID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
              >
                Role
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-slate-200">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appt) => (
                <tr key={appt.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">
                      {appt.clients?.full_name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {appt.clients?.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                    {formatTime(appt.appointment_time)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                    {maskPUID(appt.clients?.puid)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                    {appt.clients?.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={appt.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      {appt.status === "Scheduled" && (
                        <button
                          onClick={async () => {
                            await checkInClient({ apptId: appt.id });
                          }}
                          className="px-3 py-1 text-s font-medium rounded-lg text-white bg-purple-700 hover:bg-purple-800 transition cursor-pointer"
                        >
                          Check In
                        </button>
                      )}

                      {appt.status === "Checked-In" && (
                        <button
                          onClick={async () => {
                            await checkOutClient({ apptId: appt.id });
                          }}
                          className="px-3 py-1 text-s font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition cursor-pointer"
                        >
                          Check Out
                        </button>
                      )}

                      {appt.status !== "Checked-In" && appt.status !== "Completed" && appt.status !== "Canceled" && (
                        <button
                          onClick={() => handleEditPopup(appt)}
                          className="text-slate-500 hover:text-blue-600 transition cursor-pointer"
                          title="Edit Appointment"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                      )}

                      {role == 'admin' && <button
                        onClick={() => handleDeletePopup(appt)}
                        className="text-slate-500 hover:text-red-600 transition cursor-pointer"
                        title="Delete Appointment"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>}

                      {appt.status == "Scheduled" && (
                        <button 
                          onClick={async () => {
                            await cancelAppointment({ apptId: appt.id });
                          }}
                          className="text-slate-500 hover:text-orange-400 transition cursor-pointer"
                          title="Cancel Appointment"
                        >
                          <CircleX className ="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              // No appointments state
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-10 text-center text-slate-500"
                >
                  {searchQuery || statusFilter !== "All"
                    ? "No appointments match your filters."
                    : "No appointments scheduled for today."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
