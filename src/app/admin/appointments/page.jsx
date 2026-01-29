import StatCard from "@/components/admin/StatCard.jsx";
import { Calendar, FileInput, Clock, Sigma } from "lucide-react";
import { cancelAppointmentServerAction, getTodaysAppointments } from "./actions.js";
import AppointmentsTable from "./AppointmentsTable";
import { checkInClientServerAction, checkOutClientServerAction } from "./actions";
import { calculateEffectiveSlots } from "@/app/book/page";
import { getCap, getVisible } from "../logistics/actions.js";
import { getAllAppointments } from "./actions.js";


export default async function AppointmentsPage() {
  const todaysAppointments = await getTodaysAppointments();
  const allAppts = await getAllAppointments();
  const cap = await getCap();
  const vis = await getVisible();

  const totalToday = todaysAppointments.length;
  const totalCheckedIn = todaysAppointments.filter(
    (appt) => appt.status === "Checked-In"
  ).length;
  const totalUpcoming = todaysAppointments.filter(
    (appt) => appt.status === "Scheduled"
  ).length;

  const availableSlots = await calculateEffectiveSlots(cap[0].value, vis[0].value, true);

  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  
  const totalThisWeek = allAppts.filter((appt) => {
    return appt.status == "Completed" && appt.appointment_time >= monday.toISOString() && appt.appointment_time <= sunday.toISOString();
  }).length;

  return (
    <main className="space-y-6 p-8">
      <div className="justify-center space-x-13 flex flex-row">
        <StatCard
          title={"Today"}
          icon={<Calendar />}
          iconBg={"bg-amber-100"}
          value={totalToday}
        />
        <StatCard
          title={"Checked In Now"}
          icon={<FileInput />}
          iconBg={"bg-lime-200"}
          value={totalCheckedIn}
        />
        <StatCard
          title={"Upcoming"}
          icon={<Clock />}
          iconBg={"bg-orange-200"}
          value={totalUpcoming}
        />
        <StatCard
          title={"Total This Week"}
          icon={<Sigma />}
          iconBg={"bg-fuchsia-200"}
          value={totalThisWeek}
        />
      </div>

      <h1 className="text-2xl font-bold text-slate-900 ml-1 mt-10">
        Appointments
      </h1>

      <div className="">
        <AppointmentsTable
          initialAppointments={allAppts}
          checkInClient={checkInClientServerAction}
          checkOutClient={checkOutClientServerAction}
          cancelAppointment={cancelAppointmentServerAction}
          timeSlots={availableSlots}
        />
      </div>
    </main>
  );
}

export const metadata = {
  title: "Appointments | BoilerBasket",
};