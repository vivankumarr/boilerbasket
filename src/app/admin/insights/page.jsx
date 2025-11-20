"use client";

import StatCard from "@/components/StatCard.jsx"
import {CalendarCheck, Users} from "lucide-react";
import Piechart from "./Piechart.jsx"
import Linechart from "./Linechart.jsx";

export default function page () {

  return (
    <>
        <div className="w-full flex flex-row space-x-20 justify-center">
            <StatCard title={"Total Appointments"} value={67} icon={<CalendarCheck/>} iconBg={"bg-red-100"}/>
            <StatCard title={"Average Daily Visits"} value={41} icon={<Users/>} iconBg={"bg-yellow-200"}/>
            <StatCard title={"Peak Hours"} value={"5:00 PM"} icon={<Users/>} iconBg={"bg-yellow-200"}/>
        </div>
        <div className="mt-5 flex flex-row space-x-10 justify-center">
          <div className="bg-white shadow-md rounded-lg p-10 w-120 h-110">
            <div className="flex flex-col items-center h-85">
              <span className="">Client Distribution</span>
              <Piechart></Piechart>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-10 w-120 h-110">
            <div className="flex flex-col items-center h-85">
              <span className="">Monthly Appointment Trends</span>
              <div className="w-full h-full flex items-center">
                <Linechart ></Linechart>
              </div>
            </div>
          </div>
        </div>
    </>
  )
}
