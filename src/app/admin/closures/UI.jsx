"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { addBlockedDate } from "./actions";
import { PencilIcon, Trash2Icon, CalendarIcon, LoaderCircle } from "lucide-react";
import DeleteForm from "@/components/admin/DeleteForm";
import Edit from "./Edit";

const tableColStyle = "px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider";
const tableDataStyle = "px-6 py-4 whitespace-nowrap text-sm text-slate-700";

export default function UI({dates})  {
  const [selectedDates, changeSelectedDates] = useState(null);
  const [reason, changeReason] = useState("");
  const [calendarVisible, changeVisible] = useState(false);
  const [selectedData, changeSelectedData] = useState(null);
  const [deletePopUp, changeDeletePopUp] = useState(false);

  const [editPopUp, setEditPopUp] = useState(false);
  const [editStartDate, setEditStartDate] = useState(null);
  const [editEndDate, setEditEndDate] = useState(null);
  const [editReason, setEditReason] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const isFormValid = selectedDates && selectedDates.length === 2 && reason.trim() !== "";

  async function handleSubmit (dates, reason) {
    if (dates == null) return;
    setLoading(true);
    setSuccessMessage(null);

    try {
      await addBlockedDate({start: dates[0], end: dates[1], reason: reason});

      setLoading(false);
      setSuccessMessage("Closure added successfully!");

      changeSelectedDates(null);
      changeReason("");
      changeVisible(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Failed to add date", error);
      setErrorMessage("Failed to add closure. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleDeletePopUp = () => {
    changeDeletePopUp(false);
  }

  function deleteClosure(id) {
    changeSelectedData(id);
    changeDeletePopUp(true);
  }

  function openEdit(id, start, end, reason) {
    changeSelectedData(id);
    setEditStartDate(start);
    setEditEndDate(end);
    setEditPopUp(true);
    setEditReason(reason);
  }

  function formatDateForDisplay(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-us", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <div className="flex h-full overflow-y-auto">
      <div className="flex-1 h-screen">
        <div className="bg-white rounded p-6 m-6 shadow-lg flex flex-col justify-center">
          <div className="h-1/2">
            <h2 className="font-bold text-lg mb-2">Add a Closure</h2>
          </div>

          <div className="flex flex-col justify-center align-middle ">
            <div className="relative mb-4">
              <button onClick={() => {changeVisible(!calendarVisible)}} className="w-full border border-slate-400 h-12 rounded flex flex-row items-center space-x-5 p-5 hover:bg-slate-100 cursor-pointer mb-4">
                <CalendarIcon className="text-gray-600"/>
                {selectedDates ? (
                  <div>
                    <span className="text-gray-600"> {selectedDates[0].toLocaleString().split(",")[0]} to {selectedDates[1].toLocaleString().split(",")[0]} </span>
                  </div>
                ) : (
                  <span className="text-gray-400">Select Date(s)</span>
                )}
              </button>

              {calendarVisible &&
                <div className="absolute z-20 mt-2 bg-white border border-gray-200 shadow-xl rounded-xl p-4 animate-in fade-in slide-in-from-top-2 left-0">
                  <Calendar value={selectedDates} className="border-100 p-5 mb-4 rounded" selectRange={true} onChange={changeSelectedDates}/>
                  <div className="flex justify-end mt-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => {changeVisible(false)}}
                      className="text-sm text-purple-600 font-medium hover:text-purple-800 cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              }
            </div>

            <div className="flex justify-between items-center">
              <input onClick={() => {changeVisible(false)}} placeholder= "Enter the reason for closure" value={reason} onChange={(e) => changeReason(e.target.value)} type="text"  disabled={loading} className="h-12 border border-slate-400 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"/>
              <button
                onClick={() => {handleSubmit(selectedDates, reason)}}
                disabled={loading || !isFormValid}
                className={`font-medium py-2.5 px-5 rounded-lg shadow-md flex items-center justify-center gap-2 ml-5 h-12 w-48 transition-all ${loading || !isFormValid ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed" : "bg-purple-700 hover:bg-purple-800 text-white cursor-pointer"}`}>
                {loading ? (
                  <>
                    <LoaderCircle className="animate-spin h-5 w-5"/>
                    <span className="text-sm font-semibold">Adding...</span>
                  </>
                ) : (
                  <>
                    <span className="text-3xl mb-1 font-normal">+</span>
                    <span className="text-sm font-semibold">Add Closure</span>
                  </>
                )}
              </button>
            </div>

            {successMessage && (
              <p className="mt-3 text-green-700 font-medium text-sm animate-in fade-in slide-in-from-top-1">{successMessage}</p>
            )}

            {errorMessage && (
              <p className="mt-3 text-red-700 font-medium text-sm animate-in fade-in slide-in-from-top-1">{errorMessage}</p>
            )}

          </div>
        </div>

        <DeleteForm
          deletePopup={deletePopUp}
          setDeletePopup={changeDeletePopUp}
          apptId={selectedData}
          onSuccess={handleDeletePopUp}
          context={"blockedDates"}
        />

        {editPopUp && (<Edit
          isOpen={editPopUp}
          changeOpen={setEditPopUp}
          currentStart={editStartDate}
          currentEnd={editEndDate}
          currentReason={editReason}
          id = {selectedData}
        />)}

        {/* Box that contains the Blocked Dates */}
        <div className="bg-white rounded p-4 m-6 shadow overflow-x-auto">
            <h2 className="font-bold text-lg mb-4">Currently Blocked Dates</h2>
            <table className='min-w-full divide-y divide-slate-200'>
                <thead className="bg-slate-50">
                    <tr>
                    <th scope="col" className={tableColStyle}>
                        Start Date
                    </th>
                    <th scope="col" className={tableColStyle}>
                        End Date
                    </th>
                    <th scope="col" className={tableColStyle}>
                        Reason
                    </th>
                    <th scope="col" className={tableColStyle}>
                        Action
                    </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {dates.length > 0 && (
                        dates.map((date) => (
                            <tr key = {date.id}>
                                <td className={tableDataStyle}>{formatDateForDisplay(date.start_date)}</td>
                                <td className={tableDataStyle}>{formatDateForDisplay(date.end_date)}</td>
                                <td className={tableDataStyle}>{date.reason}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                                    <PencilIcon onClick={() => {openEdit(date.id, date.start_date, date.end_date, date.reason)}} className="text-slate-500 hover:text-blue-600 transition cursor-pointer"/>
                                    <Trash2Icon onClick={() => {deleteClosure(date.id)}} className="text-slate-500 hover:text-red-600 transition cursor-pointer"/>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>

      </div>
    </div>
  );
}