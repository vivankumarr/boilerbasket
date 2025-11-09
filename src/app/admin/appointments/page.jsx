import StatCard from "@/components/StatCard.jsx"
import { Calendar, FileInput, Clock, Sigma } from "lucide-react";
import { getTodaysAppointments } from "@/lib/data.js";
import AppointmentsTable from "@/components/admin/AppointmentsTable";

export default async function AppointmentsPage () {

  const todaysAppointments = await getTodaysAppointments();

  const totalToday = todaysAppointments.length;
  const totalCheckedIn = todaysAppointments.filter(appt => appt.status === 'Checked-In').length;
  const totalUpcoming = todaysAppointments.filter(appt => appt.status === 'Scheduled').length;
  
  return (
    <main className="space-y-6">
        <div className="justify-center space-x-13 flex flex-row">
            <StatCard title={"Today"} icon={<Calendar />} iconBg={"bg-amber-100"}
              value={totalToday}/>
            <StatCard title={"Checked In"} icon={<FileInput />} iconBg={"bg-lime-200"}
            value={totalCheckedIn}/>
            <StatCard title={"Upcoming"} icon={<Clock />} iconBg={"bg-orange-200"}
            value={totalUpcoming}/>
            <StatCard title={"Total This Week"} icon={<Sigma />} iconBg={"bg-fuchsia-200"}
            value={4}/>
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 ml-4 mt-10">
          Today's Appointments
        </h1>

        <div className="px-4">
          <AppointmentsTable initialAppointments={todaysAppointments} />
        </div>
    </main>
  )
}

export const metadata = {
  title: 'BoilerBasket | Appointments',
  description: 'Track and manage client appointments'
}