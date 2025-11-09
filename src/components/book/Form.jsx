"use client";

import { useState, useEffect } from 'react'

const Form = ({timeSlots = []}) => {
    const [name, setName] = useState('');
    const [puid, setPuid] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [date, setDate] = useState('');
    const [times, setTime] = useState('');
    const [canSee, setSee] = useState({beg: 0, end: 4});

    const dateToTimesMap = timeSlots.reduce((acc, slot) => {
      if (!acc[slot.date]) {
        acc[slot.date] = {
          date: slot.date,
          day: slot.day,
          displayDate: new Date(slot.date).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
          }),
          times: []
        };
      }
      acc[slot.date].times.push(slot);
      return acc;
    }, {});

    const moveVisibleDates = (direction) => {
      setSee(prev => {
        const newBeg = prev.beg + direction;
        const newEnd = prev.end + direction;

        if (newBeg < 0) return prev;
        if (newEnd > shownDates.length) return prev;

        return {beg: newBeg, end: newEnd};
      });
    }

    const shownDates = Object.values(dateToTimesMap);
    const visibleDates = shownDates.slice(canSee.beg, canSee.end);
    const visibleTimes = date ? dateToTimesMap[date].times : [];

  return (
    <>
        <div className="bg-white shadow-xl w-120 p-6 mt-10 mb-10 rounded-xl flex flex-col">
            <span className="text-2xl font-bold">Book Your Appointment</span>
            <span className="text-sm text-slate-500 mb-1 mt-1">Fill in your details below</span>

            <div className="flex flex-col items-center">
              <div className="grid grid-cols-2 grid-rows-2 gap-5 mt-4 w-full">
                  <div>
                    <span className="text-base font-medium text-slate-700 block mb-1.5 ">Full Name</span>
                    <input placeholder="Enter your full name" onChange={(e) => {setName(e.target.value)}} className="border border-slate-400 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" type="text" />
                  </div>
                  <div>
                    <span className="text-base font-medium text-slate-700 block mb-1.5">Role</span>
                    <select value={role} onChange={(e) => setRole(e.target.value)} className="border border-slate-400 p-2.5 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" name="roles" id="">
                      <option className="text-base" value="" disabled>Select your role</option>
                      <option value="student">Student</option>
                      <option value="staff">Faculty</option>
                      <option value="other">Staff</option>
                    </select>
                  </div>
                  <div>
                    <span className="text-base font-medium text-slate-700 block mb-1.5">Email Address</span>
                    <input placeholder="Enter your email address"onChange={(e) => {setEmail(e.target.value)}} className="border border-slate-400 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" type="text" />
                  </div>
                  <div>
                    <span className="text-base font-medium text-slate-700 block mb-1.5">PUID</span>
                    <input placeholder="Enter your full Purdue ID"onChange={(e) => {setPuid(e.target.value)}}className="border border-slate-400 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" type="text" />
                  </div>
              </div>

              <div className="w-full mt-8 h-30">
                <label className = "text-base font-medium text-slate-700 block mb-3">Select Date</label>
                <div id="Dates" className="w-full flex flex-row justify-center items-center gap-2">
                  <button
                    onClick={() => moveVisibleDates(-1)}
                    className={`hover:bg-slate-100 p-2 rounded-lg text-xl transition-all ${canSee.beg === 0 ? 'invisible' : ''}`}
                  >
                    ᐸ
                  </button>
                  {visibleDates.map((dateSlot) => (
                    <button 
                      onClick={() => {date !== dateSlot.date ? setTime('') : null, setDate(dateSlot.date)}} 
                      key = {dateSlot.date}
                      type = "button" 
                      className={`flex flex-col items-center border px-4 py-3 rounded-lg transition-all hover:shadow-md ${date === dateSlot.date ? 'bg-purple-600 text-white border-purple-600' : 'hover:border-purple-400 bg-white'}`}>
                        <div className="text-xs font-medium">{dateSlot.day}</div>
                        <div className="text-sm font-semibold mt-0.5">{dateSlot.date.split('-')[1] + "/" + dateSlot.date.split('-')[2]}</div>
                    </button>
                  ))}
                  <button
                    onClick={() => moveVisibleDates(1)}
                    className={`hover:bg-slate-100 p-2 rounded-lg text-xl transition-all ${canSee.end === shownDates.length ? ('invisible') : {}}`}
                  >
                  ᐳ
                  </button>
                </div>
              </div>

              <div className="w-full mt-2">
                <label className = "text-base font-medium text-slate-700 block mb-3">Select Time</label>
                <div id="times" className="w-full flex flex-wrap gap-2.5 justify-center min-h-24">
                    {date && visibleTimes.map((time) => (
                      <button 
                        onClick={() => {setTime(time.time)}}
                        key={time.time} 
                        type="button" 
                        className={`px-5 py-2.5 text-sm font-medium rounded-lg border transition-all hover:shadow-md ${times === time.time ? 'bg-purple-600 text-white border-purple-600' : 'hover:border-purple-400 bg-white'}`}>{time.time}</button>
                    ))}
                    {!date && (
                      <div className = "flex items-center justify-center w-full h-14 text-slate-500 text-sm">Choose a date to view avaliable times.</div>
                    )}
                </div>
              </div>

              <button className="mt-8 bg-purple-600 hover:bg-purple-700 py-3 px-6 rounded-lg w-full text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transform transition-transform duration-300">Confirm Booking</button>
            </div>
        </div>
    </>
  )
}

export default Form