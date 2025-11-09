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
        <div className="bg-white shadow-2xl h-155 w-120 p-5 mt-10 mb-10 rounded-2xl flex flex-col">
            <span className="text-2xl font-bold">Book Your Appointment</span>
            <div className="flex flex-col items-center">
              <div className="grid grid-cols-2 grid-rows-2 gap-4 mt-4">
                  <div>
                    <span className="text-lg ">Full Name</span>
                    <input placeholder="Enter your full name" onChange={(e) => {setName(e.target.value)}} className="border border-gray-600 p-1 w-52 rounded-xs" type="text" />
                  </div>
                  <div>
                    <span className="text-lg">Role</span>
                    <select value={role} onChange={(e) => setRole(e.target.value)} className="border border-gray-600 h-8.5 w-52 p-1 rounded-xs" name="roles" id="">
                      <option className="text-lg" value="" disabled>Select your role</option>
                      <option value="student">Student</option>
                      <option value="staff">Staff</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <span className="text-lg">Email Address</span>
                    <input placeholder="Enter your email address"onChange={(e) => {setEmail(e.target.value)}} className="border border-gray-600 p-1 w-52 rounded-xs"type="text" />
                  </div>
                  <div>
                    <span className="text-lg">PUID</span>
                    <input placeholder="Enter your full Purdue ID"onChange={(e) => {setPuid(e.target.value)}}className="border border-gray-600 p-1 w-52 rounded-xs" type="text" />
                  </div>
              </div>

              <div className="w-full mt-5 h-30">
                <span>Select Date</span>
                <div id="Dates" className="w-full flex flex-row mt-3 justify-center">
                  <button
                    onClick={() => moveVisibleDates(-1)}
                    className={`hover:cursor-pointer hover:text-purple-900 mr-2 text-2xl ${canSee.beg === 0 ? ('invisible') : {}}`}
                  >
                    ᐸ
                  </button>
                  {visibleDates.map((dateSlot) => (
                    <button onClick={() => {date !== dateSlot.date ? setTime('') : null, setDate(dateSlot.date)}} key = {dateSlot.date} type = "button" className={`hflex flex-col items-center border mr-4 ml-0.75 hover:cursor-pointer h-15 w-25 rounded-sm ${date === dateSlot.date ? 'bg-secondary text-white' : 'hover:border-purple-500 hover:text-purple-500'}`}>
                        <div className="text-sm font-medium">{dateSlot.day}</div>
                        <div className="text-sm font-medium">{dateSlot.date.split('-')[1] + "/" + dateSlot.date.split('-')[2]}</div>
                    </button>
                  ))}
                  <button
                    onClick={() => moveVisibleDates(1)}
                    className={`hover:cursor-pointer text-2xl hover:text-purple-200 ${canSee.end === shownDates.length ? ('invisible') : {}}`}
                  >
 ᐳ
                  </button>
                </div>
              </div>

              <div className="w-full h-53">
                <span>Select Time</span>
                <div id="times" className="w-full ml-2 justify-center">
                    {date && visibleTimes.map((time) => (
                      <button onClick={() => {setTime(time.time)}}key={time.time} type="button" className={`hover:cursor-pointer text-xs rounded-sm border mt-2 h-10 w-18 mr-4 ${times === time.time ? 'bg-secondary text-white' : 'hover:border-purple-900 hover:text-purple-900'}`}>{time.time}</button>
                    ))}
                    {!date && (
                      <span>Choose a date to view avaliable times.</span>
                    )}
                </div>
              </div>

              <button className="btn bg-secondary pt-2 pb-2 pr-1 pl-1 rounded-sm w-75 text-white  hover:shadow-lg hover:bg-purple-900 hover:scale-105 transform transition-transform duration-300">Confirm Booking</button>

            </div>
        </div>
    </>
  )
}

export default Form