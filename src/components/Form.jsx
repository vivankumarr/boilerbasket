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
    console.log('Visible Dates: ', visibleDates);
    console.log('Visible times: ', visibleTimes);

    useEffect(() => {
      console.log(name);
      console.log(role);
      console.log(puid);
      console.log(email);
    }, [name, role, puid, email]);

        const handleSubmit = async () => {
      if (!name || !email || !date || !times) {
        alert("Please fill out all required fields.");
        return;
      }

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          puid,
          role,
          date,
          time: times
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Your booking submission has been received. Check your email for confirmation.");
        setName('');
        setEmail('');
        setPuid('');
        setRole('');
        setDate('');
        setTime('');
      } else {
        alert(`Error: ${data.error}`);
      }
    };

  return (
    <>
        <div className="bg-white shadow-2xl h-150 w-100 p-5 mt-10 mb-10 rounded-2xl flex flex-col">
            <span className="text-2xl">Book Your Appointment</span>
            <div className="flex flex-col items-center">
              <div className="grid grid-cols-2 grid-rows-2 gap-4 mt-4">
                  <div>
                    <span>Full Name</span>
                    <input onChange={(e) => {setName(e.target.value)}} className="border" type="text" />
                  </div>
                  <div>
                    <span>Role</span>
                    <select onChange={(e) => {setRole(e.target.value)}} className="border h-6.5 w-45" name="roles" id="">
                      <option value="default"></option>
                      <option value="student">Student</option>
                      <option value="staff">Staff</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <span>Email Address</span>
                    <input onChange={(e) => {setEmail(e.target.value)}} className="border"type="text" />
                  </div>
                  <div>
                    <span>PUID</span>
                    <input onChange={(e) => {setPuid(e.target.value)}}className="border" type="text" />
                  </div>
              </div>

              <div className="w-full mt-5 h-30">
                <span>Select Date</span>
                <div id="Dates" className="w-full flex flex-row mt-3 justify-center">
                  <button
                    onClick={() => moveVisibleDates(-1)}
                    className="hover:cursor-pointer mr-2 text-2xl"
                  >
                    ←
                  </button>
                  {visibleDates.map((dateSlot) => (
                    <button onClick={() => {date !== dateSlot.date ? setTime('') : null, setDate(dateSlot.date)}} key = {dateSlot.date} type = "button" className={`border mr-5 hover:cursor-pointer h-15 w-20 rounded-sm ${date === dateSlot.date ? 'bg-purple-300' : ''}`}>
                        <div className="text-sm font-medium">{dateSlot.day}</div>
                        <div className="text-sm font-medium">{dateSlot.date.split('-')[1] + "/" + dateSlot.date.split('-')[2]}</div>
                    </button>
                  ))}
                  <button
                    onClick={() => moveVisibleDates(1)}
                    className="hover:cursor-pointer text-2xl"
                  >
                    →
                  </button>
                </div>
              </div>

              <div className="w-full h-55">
                <span>Select Time</span>
                <div id="times" className="w-full">
                    {date && visibleTimes.map((time) => (
                      <button onClick={() => {setTime(time.time)}}key={time.time} type="button" className={`hover:cursor-pointer text-xs border mt-2 h-10 w-18 mr-4 ${times === time.time ? 'bg-purple-300' : ''}`}>{time.time}</button>
                    ))}
                    {!date && (
                      <span>Choose a date to view avaliable times.</span>
                    )}
                </div>
              </div>

              <button 
                onClick={handleSubmit} 
                className="mt-auto btn bg-secondary pt-2 pb-2 pr-1 pl-1 rounded-sm w-50 text-white">
                Confirm Booking
              </button>


            </div>
        </div>
    </>
  )
}

export default Form
