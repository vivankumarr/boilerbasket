import StatCard from "@/components/StatCard.jsx"
import {CalendarCheck, Users} from "lucide-react";
import { Chart } from "chart.js";

export default function page () {

  return (
    <>
        <div className="w-full flex flex-row space-x-20 justify-center">
            <StatCard title={"Total Appointments"} value={67} icon={<CalendarCheck/>} iconBg={"bg-red-100"}/>
            <StatCard title={"Average Daily Visits"} value={41} icon={<Users/>} iconBg={"bg-yellow-200"}/>
            <StatCard title={"Peak Hours"} value={"5:00 PM"} icon={<Users/>} iconBg={"bg-yellow-200"}/>
        </div>
    </>
  )
}
