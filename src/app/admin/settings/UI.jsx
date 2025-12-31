"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { addBlockedDate } from "./actions";
import { PencilIcon, Trash2Icon } from "lucide-react";

const tableColStyle = "px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider";
const tableDataStyle = "px-6 py-4 whitespace-nowrap text-sm text-slate-700";


export default function UI({dates})  {

    const [selectedDates, changeSelectedDates] = useState(null);
    const [reason, changeReason] = useState("");


    function handleSubmit (dates, reason) {
        if (dates == null) return;
        addBlockedDate({start: dates[0], end: dates[1], reason: reason});
        changeSelectedDates(null);
        changeReason("");
    }

  return (
    <div className="flex h-screen">
      {/* MAIN content: settings stuff goes here */}
      <div className="flex-1 h-screen">
        {/* Large Box */}
          {/* Calendar input */}
        <div className="bg-white rounded p-6 m-6 h-3/4 shadow-lg">
          <h2 className="font-bold text-lg mb-2">Add a Closure</h2>

          {/*Replaced date selector with calendar, allows for ranges AND single selection*/}
          <Calendar value={selectedDates} className="p-5 mb-4 rounded" selectRange={true} onChange={changeSelectedDates}/>
          <div className="mb-2">
            <span>Reason for Closure</span>
          </div>
          <input value={reason} onChange={(e) => changeReason(e.target.value)} type="text" className="border rounded p-2 mb-4"/>

            {/* Add closure button*/}
           
                      {/* Making sure thhis button adds closure and reaspn
                        to the currently blocked dates  */}
          <button onClick={() => {handleSubmit(selectedDates, reason)}} className="cursor-pointer bg-[#741FA8] w-50 text-white px-4 py-2 rounded flex items-center justify-center gap-2 hover:bg-purple-800">
            <span className="text-sm font-normal">+</span>
            <span className="text-sm font-semibold">Add Closure</span>
          </button>

        </div>
        {/* Small Box */}
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
                    {dates.length > 0 ? (
                        dates.map((date) => (
                            <tr key = {date.id}>
                                <td className={tableDataStyle}>{date.start_date}</td>
                                <td className={tableDataStyle}>{date.end_date}</td>
                                <td className={tableDataStyle}>{date.reason}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium \
										flex gap-2">
                                    <PencilIcon
												className="text-slate-500 hover:text-blue-600 transition"
											/>
                                    
                                    <Trash2Icon className="text-slate-500 hover:text-red-600 transition"/>

                                </td>

                            </tr>
                        ))
                    ) : (
                        <div></div>     
                    )}
                </tbody>


            </table>

          {/* Entries to the blocked Dates table*/}
          
        </div>

      </div>
    </div>
  );
}