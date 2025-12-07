'use client';
import { useState } from 'react';
import StatCard from "@/components/StatCard.jsx"
import {CalendarCheck, Users, ChevronLeft, ChevronRight, Clock} from "lucide-react";
import Piechart from "./components/Piechart"
import Linechart from "./components/Linechart";
import Barchart from './components/Barchart';
import BottomDash from './components/BottomDash';

export default function Dashboard ({ length, average, best_hour, ampm, counts, ordered_months }){
  const [expandedLine, setExpandedLine] = useState(false);
  const [expandedBar, setExpandedBar] = useState(false);
  const [expandedPie, setExpandedPie] = useState(false);
  const [expandedOne, setExpandedOne] = useState(false);
  
  return (
    <div className="w-full px-4 py-6 max-w-7xl mx-auto">
      <div className="w-full flex flex-col md:flex-row gap-4 md:gap-12 justify-center mb-8">
        <StatCard 
          title={"Total Appointments"} 
          value={length} 
          icon={<CalendarCheck/>} 
          iconBg={"bg-red-100"}
        />
        <StatCard 
          title={"Average Daily Visits"} 
          value={average} 
          icon={<Users/>} 
          iconBg={"bg-yellow-200"}
        />
        <StatCard 
          title={"Peak Hour"} 
          value={best_hour + ampm} 
          icon={<Clock/>} 
          iconBg={"bg-indigo-200"}
        />
      </div>

      <div className={`flex justify-center items-start transition-all duration-500 ease-in-out ${!expandedOne ? 'gap-6' : 'gap-0'}`}>
        <div className={`relative bg-white shadow-md rounded-lg transition-all duration-500 ease-in-out flex-shrink-0 ${
          expandedPie 
            ? 'w-full max-w-5xl h-[600px] p-6' 
            : expandedOne 
              ? 'w-0 h-0 opacity-0 scale-95 p-0 overflow-hidden pointer-events-none' 
              : 'w-full md:w-80 h-[380px] p-6'
        }`}>
          {(!expandedOne || expandedPie) && (
            <>
              <button 
                onClick={() => {setExpandedPie(!expandedPie); setExpandedOne(!expandedOne)}} 
                className="absolute top-4 left-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer z-10 transition-colors"
              >
                {expandedPie ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
              </button>
              <div className="flex flex-col justify-center items-center h-full">
                <span className="text-lg font-semibold mb-4">Client Distribution</span>
                <div className={`w-full ${expandedLine ? 'h-full' : 'h-[290px]'} flex-1 flex items-center justify-center`}>
                  <Piechart q_data={counts} />
                </div>
              </div>
            </>
          )}
        </div>

        <div className={`relative bg-white shadow-md rounded-lg transition-all duration-500 ease-in-out flex-shrink-0 ${
          expandedBar 
            ? 'w-full max-w-5xl h-[600px] p-6' 
            : expandedOne 
              ? 'w-0 h-0 opacity-0 scale-95 p-0 overflow-hidden pointer-events-none' 
              : 'w-full md:w-96 h-[380px] p-6'
        }`}>
          {(!expandedOne || expandedBar) && (
            <>
              <button 
                onClick={() => {setExpandedBar(!expandedBar); setExpandedOne(!expandedOne)}} 
                className="absolute top-4 left-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer z-10 transition-colors"
              >
                {expandedBar ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
              </button>
              <div className="flex flex-col justify-center items-center h-full">
                <span className="text-lg font-semibold mb-4">Client Visiting Distribution</span>
                <div className={`w-full ${expandedBar ? 'h-full' : 'h-[290px]'} flex-1 flex items-center justify-center`}>
                  <Barchart />
                </div>
              </div>
            </>
          )}
        </div>

        <div className={`relative bg-white shadow-md rounded-lg transition-all duration-500 ease-in-out flex-shrink-0 ${
          expandedLine 
            ? 'w-full max-w-5xl h-[600px] p-6' 
            : expandedOne 
              ? 'w-0 h-0 opacity-0 scale-95 p-0 overflow-hidden pointer-events-none' 
              : 'w-full md:w-80 h-[380px] p-6'
        }`}>
          {(!expandedOne || expandedLine) && (
            <>
              <button 
                onClick={() => {setExpandedLine(!expandedLine); setExpandedOne(!expandedOne)}} 
                className="absolute top-4 left-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer z-10 transition-color"
              >
                {expandedLine ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
              </button>
              <div className="flex flex-col justify-center items-center h-full">
                <span className="text-lg font-semibold mb-4">Monthly Appt Trends</span>
                <div className={`w-full ${expandedLine ? 'h-full' : 'h-[290px]'} flex items-center justify-center`}>
                  <Linechart ordering={ordered_months} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-col md:flex-row w-full gap-4 md:gap-6 justify-center">
        <BottomDash 
          title={"Average Performance by Day"} 
          firstheading={"Tuesday"} 
          secondheading={"Sunday"} 
          firstdesc={"Primary day"} 
          seconddesc={"Secondary day"} 
          firstval={"24"} 
          secondval={"16"}
        />
        <BottomDash 
          title={"Predicted Demand"} 
          firstheading={"Next Tuesday"} 
          secondheading={"Next Sunday"} 
          firstdesc={"High Confidence (92%)"} 
          seconddesc={"Medium Confidence (65%)"} 
          firstval={"26 - 30"} 
          secondval={"13 - 17"}
        />
      </div>
    </div>
  );
}