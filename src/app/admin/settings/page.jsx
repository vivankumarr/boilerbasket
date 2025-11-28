"use client";

import { React, useState } from "react";
import DateRangePicker from "@/components/admin/DateRangePicker.jsx";

export default function SettingsPage () {
  // This state holds the data to be sent to Supabase
  const [selectedRange, setSelectedRange] = useState(null);

  // This key is used to force the DateRangePicker to reset after submission
  const [formResetKey, setFormResetKey] = useState(0);

    return (
      <div className="w-full max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Add a Closure</h2>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-600">Select Closed Dates</label>
              <DateRangePicker className="w-full sm:w-[300px]" resetKey={formResetKey} onUpdate={(val) => setSelectedRange}/>
            </div>

            {/* TO DO: 
              1. Create "Reason" text input field as well as the useState for it.
              2. Create "handleSave" function that calls the Server Action (saving data to Supabase).
              3. On success, call setFormResetKey(prev => prev + 1) to clear the date picker. */}
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-md overflow-hidden border border-slate-200 mt-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Date(s)
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                
                {/* TODO: Map through your 'blockedPeriods' state here. Some example code below: /*}
                
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