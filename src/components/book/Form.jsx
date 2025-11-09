"use client";

import { useState, useEffect } from 'react'


const Form = ({timeSlots = []}) => {
    const [name, setName] = useState('');
    const [puid, setPuid] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');

    const [date, setDate] = useState('');
    const [times, setTime] = useState('');
    const [selectedTimestamp, setSelectedTimestamp] = useState(null); // ISO timestamp for database

    const [canSee, setSee] = useState({beg: 0, end: 4});

    // shows error message for booking form
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [conflict, setConflict] = useState(null); // holds conflict response when server returns conflict
    const [success, setSuccess] = useState(false);

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

    // booking form submission logic
    async function submitBooking(force_update = false) {
    setMessage(null);
    setSuccess(false);

    // basic client-side validation
    if (!puid || puid.trim() === "") {
      setMessage("PUID is required.");
      return;
    }
    if (!selectedTimestamp) {
      setMessage("Please select a date and time for your appointment.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: name.trim() || null,
        puid: String(puid).trim(),
        email: email ? String(email).trim().toLowerCase() : null,
        role: role || null,
        appointment_timestamp: selectedTimestamp, // ISO string expected by server
        force_update,
      };

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok && !result) {
        setMessage("Server error. Please try again.");
        setLoading(false);
        return;
      }

      // Conflict: server found differences and returned diffs (ask user to confirm)
      if (result.conflict) {
        setConflict(result); // store the server response (client + diffs)
        setMessage(null);
        setLoading(false);
        return;
      }

      // Error
      if (!result.success) {
        setMessage(result.error || "An error occurred. Please try again.");
        setLoading(false);
        return;
      }

      // Success
      setSuccess(true);
      setMessage("Appointment booked! You should receive a confirmation email shortly.");
      setConflict(null);
      // clear form
      setName(""); setPuid(""); setEmail(""); setRole("");
    } catch (err) {
      setMessage("Unexpected error: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  // When user clicks "Overwrite & Continue" in the conflict UI
  const handleForceOverwrite = async () => {
    if (!conflict) return;
    await submitBooking(true); // will re-send with force_update: true
  };
  
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
                    <select  onChange={(e) => {setRole(e.target.value)}} className="border border-gray-600 h-8.5 w-52 p-1 rounded-xs" name="roles" id="">
                      <option className="text-lg"value="default" disabled selected hidden>Select your role</option>
                      <option value="Student">Student</option>
                      <option value="Staff">Staff</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <span className="text-lg">Email Address</span>
                    <input placeholder="Enter your Email address"onChange={(e) => {setEmail(e.target.value)}} className="border border-gray-600 p-1 w-52 rounded-xs"type="text" />
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
                    className={`hover:cursor-pointer hover:text-purple-200 mr-2 text-2xl ${canSee.beg === 0 ? ('invisible') : {}}`}
                  >
                    ᐸ
                  </button>
                  {visibleDates.map((dateSlot) => (
                    <button onClick={() => {
                    if (date !== dateSlot.date) {
                      setTime("");
                      setSelectedTimestamp(null);
                    }
                    setDate(dateSlot.date)}} key = {dateSlot.date} type = "button" className={`hflex flex-col items-center border mr-4 ml-0.75 hover:cursor-pointer h-15 w-25 rounded-sm ${date === dateSlot.date ? 'bg-secondary text-white' : 'hover:border-purple-500 hover:text-purple-500'}`}>
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
                      <button onClick={() => {setTime(time.time); setSelectedTimestamp(time.timestamp)}}key={time.time} type="button" className={`hover:cursor-pointer text-xs rounded-sm border mt-2 h-10 w-18 mr-4 ${times === time.time ? 'bg-secondary text-white' : 'hover:border-purple-500 hover:text-purple-500'}`}>{time.time}</button>
                    ))}
                    {!date && (
                      <span>Choose a date to view avaliable times.</span>
                    )}
                </div>
              </div>

              <button
                disabled={loading}
                onClick={() => submitBooking(false)}
                className="btn bg-secondary pt-2 pb-2 pr-1 pl-1 rounded-sm w-75 text-white  hover:shadow-lg hover:bg-purple-600 hover:scale-105 transform transition-transform duration-300"
              >
                {loading ? "Booking..." : "Confirm Booking"}
              </button>
              {message && <p className="mt-3 text-red-600">{message}</p>}
              {success && <p className="mt-3 text-green-700">{message}</p>}
            </div>
        </div>
        {conflict && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-3">Confirm your info</h3>
            <p className="mb-4">
              We found an existing account with PUID <strong>{conflict.client.puid}</strong>. The data you entered differs from our
              records. Please confirm whether you want to overwrite the stored values with your entries.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <div className="font-semibold">Field</div>
                <div className="text-sm mt-2">Full name</div>
                <div className="text-sm mt-2">Email</div>
                <div className="text-sm mt-2">Role</div>
              </div>

              <div>
                <div className="font-semibold">Existing</div>
                <div className="text-sm mt-2">{conflict.client.full_name || "—"}</div>
                <div className="text-sm mt-2">{conflict.client.email || "—"}</div>
                <div className="text-sm mt-2">{conflict.client.role || "—"}</div>
              </div>

              <div>
                <div className="font-semibold">You entered</div>
                <div className="text-sm mt-2">{name || "—"}</div>
                <div className="text-sm mt-2">{email || "—"}</div>
                <div className="text-sm mt-2">{role || "—"}</div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setConflict(null);
                  setMessage("Cancelled. No changes were made.");
                }}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleForceOverwrite}
                className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
              >
                Overwrite & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Form
