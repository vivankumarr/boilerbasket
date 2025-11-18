"use client";

import { useState, useCallback } from 'react';
import StatCard from "@/components/StatCard.jsx";
import { Calendar, FileInput, Clock, Sigma } from "lucide-react";
import AppointmentsTable from "@/components/admin/AppointmentsTable";
import { refreshAppointments } from "@/app/admin/appointments/actions";
import { checkInClientServerAction, checkOutClient } from "@/lib/data.js";

/**
 * Client component that manages appointments state and stat calculations
 * When appointments are updated, we can refresh the state and all components rerender
 */
export default function AppointmentsDashboard({ initialAppointments = [] }) {
  // Store appointments in React state so we can update them after changes
  // Table and stat cards can automatically refresh
  const [appointments, setAppointments] = useState(initialAppointments);
  const [isRefreshing, setIsRefreshing] = useState(false);

  /**
   * Callback function to refresh appointments data from the server
   * This is passed down to AppointmentsTable so it can trigger a refresh
   * after updating an appointment (e.g., checking in, deleting)
   */
  const handleRefreshAppointments = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const freshAppointments = await refreshAppointments();
      setAppointments(freshAppointments);
    } catch (error) {
      console.error('Error refreshing appointments:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Wrapper functions that update appointment status and refresh data
  const handleCheckIn = useCallback(async ({ apptId }) => {
    await checkInClientServerAction({ apptId });
    await handleRefreshAppointments();
  }, [handleRefreshAppointments]);

  const handleCheckOut = useCallback(async ({ apptId }) => {
    await checkOutClient({ apptId });
    await handleRefreshAppointments();
  }, [handleRefreshAppointments]);

  // Calculate stats from the current appointments state
  // These update when appointments state changes
  const totalToday = appointments.length;
  const totalCheckedIn = appointments.filter(appt => appt.status === 'Checked-In').length;
  const totalUpcoming = appointments.filter(appt => appt.status === 'Scheduled').length;

  // Calculate total appointments this week
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  const totalThisWeek = appointments.filter(appt => {
    const apptDate = new Date(appt.appointment_time);
    return apptDate >= monday && apptDate <= sunday;
  }).length;

  return (
    <main className="space-y-6">
      <div className="justify-center space-x-13 flex flex-row">
        <StatCard 
          title={"Today"} 
          icon={<Calendar />} 
          iconBg={"bg-amber-100"}
          value={totalToday}
        />
        <StatCard 
          title={"Checked In"} 
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

      <h1 className="text-2xl font-bold text-slate-900 ml-4 mt-10">
        Today's Appointments
      </h1>

      <div className="px-4">
        <AppointmentsTable 
          initialAppointments={appointments}
          checkInClient={handleCheckIn}
          checkOutClient={handleCheckOut}
          onRefresh={handleRefreshAppointments}
        />
      </div>
    </main>
  );
}
