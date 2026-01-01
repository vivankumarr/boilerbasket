"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { addBlockedDate } from "./actions";
import { PencilIcon, Trash2Icon, CalendarIcon } from "lucide-react";
import DeleteForm from "@/components/admin/DeleteForm";
import Edit from "./Edit";

const tableColStyle = "px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider";
const tableDataStyle = "px-6 py-4 whitespace-nowrap text-sm text-slate-700";

export default function UI({dates})  {
  const [selectedDates, changeSelectedDates] = useState(null);
  const [reason, changeReason] = useState("");
  const [calendarVisible, changeVisibile] = useState(false);
  const [selectedData, changeSelectedData] = useState(null);
  const [deletePopUp, changeDeletePopUp] = useState(false);

  const [editPopUp, setEditPopUp] = useState(false);
  const [editStartDate, setEditStartDate] = useState(null);
  const [editEndDate, setEditEndDate] = useState(null);
  const [editReason, setEditReason] = useState(null);

  function handleSubmit (dates, reason) {
      if (dates == null) return;
      addBlockedDate({start: dates[0], end: dates[1], reason: reason});
      changeSelectedDates(null);
      changeReason("");
  }

  const handleDeletePopUp = () => {
    changeDeletePopUp(false);
    console.log("Delete pop up is now false");
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

  return (
    <div className="flex h-screen">
      <div className="flex-1 h-screen">
        <div className="bg-white rounded p-6 m-6 shadow-lg flex flex-col justify-center">
          <div className="h-1/2">
            <h2 className="font-bold text-lg mb-2">Add a Closure</h2>
          </div>
          
          <div className="flex flex-col justify-center align-middle ">
            <div className="mb-2">
              <span>Select Closure Dates</span>
            </div>

            <button onClick={() => {changeVisibile(!calendarVisible)}} className="border-1 border-gray-200 h-12 bg-slate-50 rounded flex flex-row items-center space-x-5 p-5 hover:bg-slate-100 cursor-pointer mb-4">
              <CalendarIcon className="text-gray-400"/>
              {selectedDates && (
                <div>
                  <span className="text-gray-500"> {selectedDates[0].toLocaleString().split(",")[0]} to {selectedDates[1].toLocaleString().split(",")[0]} </span>
                </div>
              )}
            </button>

            {calendarVisible && 
              <div className="bg-white border-2 border-gray-200 p-4 absolute top-52">
                <Calendar value={selectedDates} className="border-100 p-5 mb-4 rounded" selectRange={true} onChange={changeSelectedDates}/>
              </div>
            }
            <div className="flex justify-between items-center">
              <input onClick={() => {changeVisibile(false)}} placeholder= "Reason for closure" value={reason} onChange={(e) => changeReason(e.target.value)} type="text" className="border-1 border-gray-200 rounded p-3 w-full h-full"/>
              <button onClick={() => {handleSubmit(selectedDates, reason), changeVisibile(false)}} className="cursor-pointer bg-[#741FA8] text-white px-4 py-2 rounded flex items-center justify-center gap-2 ml-5 hover:bg-purple-800 w-50 h-12">
                <span className="text-sm font-normal">+</span>
                <span className="text-sm font-semibold">Add Closure</span>
              </button>
            </div>
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
            <h2 className="text-lg font-medium text-slate-700 mb-3">Currently Blocked Dates</h2>
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
                                <td className={tableDataStyle}>{date.start_date}</td>
                                <td className={tableDataStyle}>{date.end_date}</td>
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