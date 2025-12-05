"use client";

import { useState } from "react";
import { addBlockedPeriod } from "./actions";
import DateRangePicker from "@/components/admin/DateRangePicker.jsx";

export default function SettingsPage() {
  const [selectedRange, setSelectedRange] = useState(null);
  const [formResetKey, setFormResetKey] = useState(0);
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSave() {
    if (!selectedRange) return;

    setIsLoading(true);

    const payload = {
      start_date: selectedRange.from.toISOString(),
      end_date: selectedRange.to.toISOString(),
      reason,
    };

    const result = await addBlockedPeriod(payload);

    if (result.success) {
      setReason("");
      setFormResetKey((prev) => prev + 1);
      setSelectedRange(null);
    }

    setIsLoading(false);
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Add a Closure</h2>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600">
              Select Closed Dates
            </label>
            <DateRangePicker
              key={formResetKey}
              onSelect={(val) => setSelectedRange(val)}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for closure"
              className="border border-gray-300 rounded px-3 py-2 w-full sm:flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <span>➕</span>
              <span>{isLoading ? "Saving..." : "Add Closure"}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-md overflow-hidden border border-slate-200 mt-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Date(s)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {/* TODO: Map through your 'blockedPeriods' state here. Some example code below: */}
              {/* 
                {blockedPeriods.map((period) => (
                  <tr key={period.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      {format(new Date(period.start_date), "MMM dd")} - {format(new Date(period.end_date), "MMM dd, yyyy")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      {period.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleDelete(period.id)}
                        className="text-slate-500 hover:text-red-600 transition cursor-pointer"
                        title="Delete Closure"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))} 
              */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}