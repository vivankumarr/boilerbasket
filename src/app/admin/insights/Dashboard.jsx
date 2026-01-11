'use client';
import { useState } from 'react';
import Top from './Top';
import Piechart from "./Piechart"
import Linechart from "./Linechart";
import PredictionLineChart from './PredictionLineChart';

import { SquareSigma, CalendarClock, Clock, Hourglass } from "lucide-react"
const tableColStyle = "px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider";
const tableDataStyle = "px-6 py-4 whitespace-nowrap text-sm text-slate-700";

export default function Dashboard ({ days, length, freq, average, best_hour, ampm, counts, ordered_months, avg_duration, visits, pred, arrangePrediction }){
  
  return (
    <main className="p-10 pl-10 pr-10 pb-10 h-full mb-4 overflow-auto">
      {/* This is dumb */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-700 { animation-delay: 0.7s; }
      `}</style>






      <h3 className="mb-2 text-xl font-bold text-gray-600 tracking-wide truncate ml-1 animate-fade-in-up">Metrics</h3>
      <div className="w-full h-2/8 max-h-40 flex justify-between mb-7 space-x-5 animate-fade-in-up delay-200">
        <Top Title="Total Appts." Value={length} Description={"Cancelled & Completed"} Icon={<SquareSigma/>}/>
        <Top Title = "Appt. Average" Value={`${average}`} Description= {`Per Day, Over ${days} Days`} Icon={<CalendarClock/>}/>
        <Top Title="Peak Hour" Value={best_hour + ampm} Description={`Booked ${freq} Times`} Icon={<Clock/>}/>
        <Top Title="Average Visit Dur." Value={avg_duration} Description={`Minutes, Over ${visits} Successful Visits`} Icon={<Hourglass/>}/>
      </div>

      <div className="w-full h-4/5 flex space-x-5 mb-7 animate-fade-in-up delay-400">
        <div className="bg-white h-full w-2/3 mr-5 shadow-md hover:shadow-xl p-6 rounded-lg">
            <Linechart ordering={ordered_months}></Linechart>
          </div>
        <div className="bg-white h-full w-1/3 shadow-md hover:shadow-xl rounded-lg p-6">
          <Piechart q_data={counts} ></Piechart>
        </div>
      </div>

      <h3 className="mb-2 text-xl font-bold text-gray-600 tracking-wide truncate ml-1 animate-fade-in-up delay-400">Predictions</h3>

      <div className="w-full h-3/5 flex space-x-5 animate-fade-in-up delay-400">
        <div className="bg-white h-full w-1/2 mr-5 shadow-md hover:shadow-xl p-6 rounded-lg">

          <div className="bg-white roundedshadow overflow-x-auto rounded-tl-lg rounded-tr-lg">
            <table className='min-w-full divide-y divide-slate-200'>
                <thead className="bg-slate-100">
                    <tr>
                    <th scope="col" className={tableColStyle}>
                        Date
                    </th>
                    <th scope="col" className={tableColStyle}>
                        Day
                    </th>
                    <th scope="col" className={tableColStyle}>
                        Expected Visitors
                    </th>
                    <th scope="col" className={tableColStyle}>
                        Likely Range
                    </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200items-center">
                    {pred.length > 0 && (
                        pred.map((prediction) => (
                            <tr className="border-none" key = {prediction.id}>
                                <td className={tableDataStyle}>{prediction.prediction_date}</td>
                                <td className={tableDataStyle}>{prediction.day}</td>
                                <td className={tableDataStyle}>{prediction.predicted_count}</td>
                                <td className={tableDataStyle}>{`${prediction.confidence_lower} - ${prediction.confidence_upper}`}</td>
                            </tr>
                        ))
                    )}
                </tbody>
                
            </table>
          </div>

        </div>

        <div className="bg-white h-full w-1/2 shadow-md hover:shadow-xl p-6 rounded-lg">
            <PredictionLineChart arrangement={arrangePrediction}/>
        </div>
      </div>

    </main>
  );
}
