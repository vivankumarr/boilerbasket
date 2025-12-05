"use client";

import { useState } from "react";
import { addBlockedPeriod } from "./actions";

import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function SettingsPage() {
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRange, setSelectedRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [formResetKey, setFormResetKey] = useState(0);

  async function handleSave() {
    if (!selectedRange || !selectedRange[0]) return;

    setIsLoading(true);

    const payload = {
      start_date: selectedRange[0].startDate.toISOString(),
      end_date: selectedRange[0].endDate.toISOString(),
      reason,
    };

    const result = await addBlockedPeriod(payload);

    if (result.success) {
      setReason("");
      setFormResetKey((prev) => prev + 1);
      setSelectedRange([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: "selection",
        },
      ]);
    }

    setIsLoading(false);
  }

  return (
    <div className="p-6">
      <div className="mt-6 bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Add Closure</h2>
        <div className="flex flex-col gap-4">
          <div className="flex justify-start">
            <DateRangePicker
              key={formResetKey}
              ranges={selectedRange}
              onChange={(range) => setSelectedRange([range.selection])}
              staticRanges={[]}
              inputRanges={[]}
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
    </div>
  );
}