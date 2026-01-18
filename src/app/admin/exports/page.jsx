"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import * as XLSX from "xlsx";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths, startOfYear, isWithinInterval, set } from "date-fns";
import { Calendar as CalendarIcon, Download, FileSpreadsheet, Filter, ChevronDown, Info, LoaderCircle } from "lucide-react";

export default function ExportsPage() {
  const [ quickRange, setQuickRange ] = useState("This Week");
  const [ calendarDates, setCalendarDates] = useState([
    startOfWeek(new Date(), { weekStartsOn: 1 }),
    endOfWeek(new Date(), { weekStartsOn: 1 })
  ]);
  const [ isCalendarOpen, setIsCalendarOpen ] = useState(false);

  const [ roleFilter, setRoleFilter ] = useState("All Roles");
  const [ statusFilter, setStatusFilter ] = useState("All Statuses");
  const [ fields, setFields ] = useState({
    clientName: true,
    email: true,
    puid: true,
    role: true,
    appointmentDate: true,
    timeSlot: true,
    status: true,
  });

  const [ estimatedCount, setEstimatedCount ] = useState(0);
  const [ isExporting, setIsExporting ] = useState(false);

  // Effect to estimate number of records when dates/filters change
  useEffect(() => {
    async function fetchEstimate() {
      if (!calendarDates || calendarDates.length != 2) {
        return;
      }

      let query = supabase
        .from("appointments")
        .select("id, client_id, clients!inner(role)", { count: "exact", head: true })

      // Apply date range/status/role filter(s)
      const [ startRaw, endRaw ] = calendarDates;
      const startISO = startRaw.toISOString();
      const endObj = new Date(endRaw);
      endObj.setHours(23, 59, 59, 999);
      const endISO = endObj.toISOString();

      query = query.gte("appointment_time", startISO).lte("appointment_time", endISO);

      if (statusFilter !== "All Statuses") {
        query = query.eq("status", statusFilter);
      }

      if (roleFilter !== "All Roles") {
        query = query.eq("clients.role", roleFilter);
      }

      const { count, error } = await query;
      if (!error) {
        setEstimatedCount(count || 0);
      }
    }

    fetchEstimate();
  }, [calendarDates, roleFilter, statusFilter, supabase]);

  // Handler for selecting quick range
  function handleQuickRangeChange(rangeType) {
    setQuickRange(rangeType);
    const now = new Date();
    let start, end;

    switch (rangeType) { 
      case "Today":
        start = now;
        end = now;
        break;
      case "This Week":
        start = startOfWeek(now, { weekStartsOn: 1 });
        end = endOfWeek(now, { weekStartsOn: 1 });
        break;
      case "This Month":
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
      case "Past 6 Months":
        start = subMonths(now, 6);
        end = now;
        break;
      case "This Year":
        start = subMonths(now, 12);
        end = now;
        break;
      default:
        start = new Date(0);
        end = now;
    }

    setCalendarDates([start, end]);
  }

  async function handleExport() {
    setIsExporting(true);

    try {
      if (!calendarDates || calendarDates.length != 2) {
        console.error("Invalid dates.")
      }

      let query = supabase
        .from("appointments")
        .select(`
          appointment_time,
          status,
          clients!inner (
            full_name,
            email,
            puid,
            role
          )
        `);
      
      const [ startRaw, endRaw ] = calendarDates;
      const startISO = startRaw.toISOString();
      const endObj = new Date(endRaw);
      endObj.setHours(23, 59, 59, 999);
      const endISO = endObj.toISOString();

      query = query.gte("appointment_time", startISO).lte("appointment_time", endISO);

      if (statusFilter !== "All Statuses") {
        query = query.eq("status", statusFilter);
      }

      if (roleFilter !== "All Roles") {
        query = query.eq("clients.role", roleFilter);
      }

      const { data, error } = await query;
      if (error) {
        console.error("Error fetching data for export:", error);
      }
      
      const excelRows = data.map((record) => {
        const row = {};
        const dateObj = new Date(record.appointment_time);

        if (fields.clientName) row["Client Name"] = record.clients.full_name;
        if (fields.email) row["Email"] = record.clients.email;
        if (fields.puid) row["PUID"] = record.clients.puid;
        if (fields.role) row["Role"] = record.clients.role;
        if (fields.appointmentDate) row["Appointment Date"] = format(dateObj, "yyyy-MM-dd");
        if (fields.timeSlot) row["Time Slot"] = format(dateObj, "hh:mm a");
        if (fields.status) row["Status"] = record.status;

        return row;
      });

      const worksheet = XLSX.utils.json_to_sheet(excelRows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Appointments");
      XLSX.writeFile(workbook, `ACE_Data_Export_${format(new Date(), "yyyy_MM_dd")}.xlsx`);

    } catch (err) {
      console.error("Export failed:", err);
      alert("Failed to export data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="p-8 w-full mx-auto space-y-8">

      {/* Quick export card */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex justify-between items-start w-full">
        <div>
          <div className="flex items-center gap-3 mb-2 relative">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 cursor-pointer hover:text-purple-700 transition-colors">
              {quickRange}
              <ChevronDown className="w-5 h-5 text-gray-400"/>
            </h2>
            <select
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              value={quickRange}
              onChange={(e) => handleQuickRangeChange(e.target.value)}
            >
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>Past 6 Months</option>
              <option>This Year</option>
            </select>
          </div>

          <p className="text-gray-500 mb-6">
            <span className="font-semibold text-gray-900">{estimatedCount}</span> appointments from {" "}
            {calendarDates && calendarDates[0] && (
              <span>{format(calendarDates[0], "MMM dd, yyyy")} to {format(calendarDates[1], "MMM dd, yyyy")}</span>
            )}
          </p>

          <button
            onClick={handleExport}
            disabled={isExporting || estimatedCount === 0}
            className="cursor-pointer bg-[#D4AF37] hover:bg-[#c4a130] text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <LoaderCircle className="animate-spin h-5 w-5"/>
                <span className="text-sm font-semibold">Exporting...</span>
              </>
            ) : (
              <>
                <Download className="h-5 w-5"/>
                <span className="text-sm font-semibold">Export Data</span>
              </>
            )}
          </button>
        </div>

        <div className="bg-purple-100 p-4 rounded-xl hidden sm:block mt-6">
          <CalendarIcon className="h-8 w-8 text-purple-600"/>
        </div>
      </div>

      {/* Custom export card */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 min-h-[400px]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Filter className="h-6 w-6 text-blue-600"/>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Custom Export</h3>
            <p className="text-gray-500 text-sm">Customize your export parameters</p>
          </div>
        </div>

        <div className="space-y-6 relative">
          {/* New date range is selected here, replaces old inputs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Date Range</label>

            <button
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className="w-full border border-gray-300 h-12 rounded-lg flex flex-row items-center justify-between px-4 hover:bg-slate-50 cursor-pointer transition-colors focus:ring-2 focus:ring-[#D4AF37]"
            >
              <div className="flex items-center gap-3">
                <CalendarIcon className="text-gray-500 w-5 h-5"/>
                {calendarDates && calendarDates.length === 2 ? (
                  <span className="text-gray-700 font-medium">
                    {format(calendarDates[0], "MMM dd, yyyy")} to {format(calendarDates[1], "MMM dd, yyyy")}
                  </span>
                ) : (
                  <span className="text-gray-400">Select date range</span>
                )}
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isCalendarOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Popover calendar, similar to closures page */}
            {isCalendarOpen && (
              <div className="absolute z-10 mt-2 bg-white border border-gray-200 shadow-xl rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
                <Calendar
                  onChange={(dates) => {
                    setCalendarDates(dates);
                  }}
                  value={calendarDates}
                  selectRange={true}
                  className="border-0 rounded-lg"
                />
                <div className="flex justify-end mt-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => setIsCalendarOpen(false)}
                    className="text-sm text-blue-600 font-medium hover:text-blue-800 cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Dropdown filters */}
          <div className="grid grid-cold-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Client Role</label>
              <div className="relative">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-300 rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-[#D4AF37] outline-none"
                >
                  <option>All Roles</option>
                  <option>Student</option>
                  <option>Faculty</option>
                  <option>Staff</option>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Status</label>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-300 rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-[#D4AF37] outline-none"
                >
                  <option>All Statuses</option>
                  <option>Checked-In</option>
                  <option>Completed</option>
                  <option>Canceled</option>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Field selection checkboxes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Fields to Include</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { key: "clientName", label: "Client Name" },
                { key: "email", label: "Email" },
                { key: "puid", label: "PUID" },
                { key: "role", label: "Role" },
                { key: "appointmentDate", label: "Appointment Date" },
                { key: "timeSlot", label: "Time Slot" },  
                { key: "status", label: "Status" },
              ].map((field) => (
                <label key={field.key} className="flex items-center space-x-3 cursor-pointer group select-none">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${fields[field.key] ? 'bg-purple-600 border-purple-600' : 'border-gray-300 bg-white'}`}>
                    {fields[field.key] && <span className="text-white text-xs font-bold">✓</span>}
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={fields[field.key]}
                    onChange={() => setFields(prev => ({ ...prev, [field.key]: !prev[field.key] }))}
                  />
                  <span className="text-gray-600 group-hover:text-gray-900">{field.label}</span>
                </label>
              ))}
            </div>
          </div>

        <div className="pt-6 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Info className="w-5 h-5 text-gray-400"/>
            <span>Estimated Records: <strong className="text-gray-900">{estimatedCount}</strong> Appointments</span>
          </div>

          <button
            onClick={handleExport}
            disabled={isExporting || estimatedCount === 0}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
          >
            <FileSpreadsheet className="h-5 w-5"/>
            {isExporting ? (
              <>
                <LoaderCircle className="animate-spin h-5 w-5"/>
                <span className="text-sm font-semibold">Exporting...</span>
              </>
            ) : (
              <>
                <span className="text-sm font-semibold">Export Data</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  </div>
  );
}