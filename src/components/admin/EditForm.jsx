"use client";

import { useState, useEffect } from "react";
import { confirmBooking } from "@/app/book/actions";
import { editAppointment } from "@/app/admin/appointments/actions";

const EditForm = ({ apptId, previousData, showPopup, setShowPopup, timeSlots = [], currentTimestamp }) => {

  const [name, setName] = useState(previousData?.full_name || "");
  const [puid, setPuid] = useState(previousData?.puid || "");
  const [email, setEmail] = useState(previousData?.email || "");
  const [role, setRole] = useState(previousData?.role || "");

  // Time selection state (date/time UI like booking form)
  const [date, setDate] = useState("");
  const [times, setTime] = useState("");
  const [selectedTimestamp, setSelectedTimestamp] = useState(null); // ISO timestamp for database
  const [canSee, setSee] = useState({ beg: 0, end: 4 });

  useEffect(() => {
    if (previousData) {
      setName(previousData.full_name || "");
      setEmail(previousData.email || "");
      setRole(previousData.role || "");
      setPuid(previousData.puid || "");
    }
  }, [previousData]);

  // Map dates to times (same structure as booking Form)
  const dateToTimesMap = timeSlots.reduce((acc, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = {
        date: slot.date,
        day: slot.day,
        displayDate: new Date(slot.date).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        times: [],
      };
    }
    acc[slot.date].times.push(slot);
    return acc;
  }, {});

  const shownDates = Object.values(dateToTimesMap);
  const visibleDates = shownDates.slice(canSee.beg, canSee.end);
  const visibleTimes = date ? dateToTimesMap[date]?.times || [] : [];

  const moveVisibleDates = (direction) => {
    setSee((prev) => {
      const newBeg = prev.beg + direction;
      const newEnd = prev.end + direction;

      if (newBeg < 0) return prev;
      if (newEnd > shownDates.length) return prev;

      return { beg: newBeg, end: newEnd };
    });
  };


  // shows error message for booking form
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);
  // const [conflict, setConflict] = useState(null); // holds conflict response when server returns conflict

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
      setMessage("Please select a date and time for the appointment.");
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

      const result = await editAppointment(apptId, payload);

      // // Conflict: server found differences and returned diffs (ask user to confirm)
      // if (result.conflict) {
      //   setConflict(result); // store the server response (client + diffs)
      //   setMessage(null);
      //   setLoading(false);
      //   return;
      // }

      console.log("Result", result);

      // Error
      if (!result.success) {
        setMessage(result.error || "An error occurred. Please try again.");
        setLoading(false);
        return;
      }

      // Success
      setSuccess(true);
      setMessage(
        "Appointment booked! You should receive a confirmation email shortly."
      );
      // clear form
      setName("");
      setPuid("");
      setEmail("");
      setRole("");
      const name_input = document.getElementById("name_input");
      const puid_input = document.getElementById("puid_input");
      const email_input = document.getElementById("email_input");
      if (name_input) name_input.value = "";
      if (puid_input) puid_input.value = "";
      if (email_input) email_input.value = "";
      setTime("");
      setDate("");
      setShowPopup(false);
      window.location.reload();
    } catch (err) {
      setMessage("Unexpected error: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  // Preselect current appointment time in UI when popup opens
  useEffect(() => {
    if (!showPopup) return;
    // Prefer the provided currentTimestamp; fallback to previously selected
    const curr = currentTimestamp || selectedTimestamp;
    if (!curr) return;

    try {
      const iso = new Date(curr).toISOString();
      const d = iso.split("T")[0];
      // Try to find matching slot in provided timeSlots
      const match = timeSlots.find((s) => s.timestamp === iso);
      setSelectedTimestamp(iso);
      setDate(match?.date || d);
      if (match) {
        setTime(match.time);
      } else {
        // Derive display time when not in timeSlots
        const display = new Date(iso).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        });
        setTime(display);
      }
    } catch (_) {
      // no-op if invalid date
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPopup, currentTimestamp, timeSlots]);

  // When user clicks "Overwrite & Continue" in the conflict UI
  // const handleForceOverwrite = async () => {
  //   if (!conflict) return;
  //   await submitBooking(true); // will re-send with force_update: true
  // };

  return (
    <div>
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white shadow-xl w-120 p-6 mt-10 mb-10 rounded-xl flex flex-col relative z-50">
            <span className="text-2xl font-bold">Edit Your Appointment</span>
            <span className="text-sm text-slate-500 mb-1 mt-1">
              Select New Timeslot
            </span>

            <div className="flex flex-col items-center">
              {/* <div className="grid grid-cols-2 grid-rows-2 gap-5 mt-4 w-full">
                <div>
                  <span className="text-base font-medium text-slate-700 block mb-1.5 ">
                    Full Name
                  </span>
                  <input
                    id="name_input"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    className="border border-slate-400 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    type="text"
                  />
                </div>
                <div>
                  <span className="text-base font-medium text-slate-700 block mb-1.5">
                    Role
                  </span>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="border border-slate-400 p-2.5 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    name="roles"
                    id=""
                  >
                    <option className="text-base" value="" disabled>
                      Select your role
                    </option>
                    <option value="Student">Student</option>
                    <option value="Faculty">Faculty</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>
                <div>
                  <span className="text-base font-medium text-slate-700 block mb-1.5">
                    Email Address
                  </span>
                  <input
                    id="email_input"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    className="border border-slate-400 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    type="text"
                  />
                </div>
                <div>
                  <span className="text-base font-medium text-slate-700 block mb-1.5">
                    PUID
                  </span>
                  <input
                    id="puid_input"
                    value={puid}
                    onChange={(e) => {
                      setPuid(e.target.value);
                    }}
                    className="border border-slate-400 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    type="text"
                  />
                </div>
              </div> */}

              {/* Date selector (optional, shown when timeSlots provided) */}
              {timeSlots.length > 0 && (
                <div className="w-full mt-8 h-30">
                  <label className="text-base font-medium text-slate-700 block mb-3">
                    Select Date
                  </label>
                  <div
                    id="Dates"
                    className="w-full flex flex-row justify-center items-center gap-2"
                  >
                    <button
                      onClick={() => moveVisibleDates(-1)}
                      className={`hover:bg-slate-100 p-2 rounded-lg text-xl transition-all ${
                        canSee.beg === 0 ? "invisible" : ""
                      }`}
                      type="button"
                    >
                      ᐸ
                    </button>
                    {visibleDates.map((dateSlot) => (
                      <button
                        onClick={() => {
                          date !== dateSlot.date ? setTime("") : null;
                          setDate(dateSlot.date);
                        }}
                        key={dateSlot.date}
                        type="button"
                        className={`flex flex-col items-center border px-4 py-3 rounded-lg transition-all hover:shadow-md ${
                          date === dateSlot.date
                            ? "bg-purple-600 text-white border-purple-600"
                            : "hover:border-purple-400 bg-white"
                        }`}
                      >
                        <div className="text-xs font-medium">{dateSlot.day}</div>
                        <div className="text-sm font-semibold mt-0.5">
                          {dateSlot.date.split("-")[1] +
                            "/" +
                            dateSlot.date.split("-")[2]}
                        </div>
                      </button>
                    ))}
                    <button
                      onClick={() => moveVisibleDates(1)}
                      className={`hover:bg-slate-100 p-2 rounded-lg text-xl transition-all ${
                        canSee.end === shownDates.length ? "invisible" : {}
                      }`}
                      type="button"
                    >
                      ᐳ
                    </button>
                  </div>
                </div>
              )}

              {/* Time selector (optional) */}
              {timeSlots.length > 0 && (
                <div className="w-full mt-2">
                  <label className="text-base font-medium text-slate-700 block mb-3">
                    Select Time
                  </label>
                  <div
                    id="times"
                    className="w-full flex flex-wrap gap-2.5 justify-center min-h-24"
                  >
                    {date &&
                      visibleTimes.map((time) => (
                        <button
                          onClick={() => {
                            setTime(time.time);
                            setSelectedTimestamp(time.timestamp);
                          }}
                          key={time.time}
                          type="button"
                          className={`px-5 py-2.5 text-sm font-medium rounded-lg border transition-all hover:shadow-md ${
                            times === time.time
                              ? "bg-purple-600 text-white border-purple-600"
                              : "hover:border-purple-400 bg-white"
                          }`}
                        >
                          {time.time}
                        </button>
                      ))}
                    {!date && (
                      <div className="flex items-center justify-center w-full h-14 text-slate-500 text-sm">
                        Choose a date to view available times.
                      </div>
                    )}
                  </div>
                </div>
              )}


              <div className="mt-8 flex gap-3 w-full justify-between">
                <button
                disabled={loading}
                onClick={() => submitBooking(false)}
                className="bg-purple-600 hover:bg-purple-700 py-3 px-6 rounded-lg flex-1 text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transform transition-transform duration-300"
              >
                {loading ? "Booking..." : "Save"}
                </button>

                <button
                disabled={loading}
                onClick={() => setShowPopup(false)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 py-3 px-6 rounded-lg flex-1 font-medium shadow-sm transition"
              >
                {loading ? "Booking..." : "Cancel"}
                </button>
              </div>

              {!success && message && (
                <p className="mt-3 text-red-600">{message}</p>
              )}
              {success && <p className="mt-3 text-green-700">{message}</p>}
            </div>
          </div>

          {/* Conflict Popup
          {conflict && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
              <div className="bg-white rounded-lg p-6 w-full max-w-xl shadow-lg">
                <h3 className="text-lg font-semibold mb-3">
                  Confirm your info
                </h3>
                <p className="mb-4">
                  We found an existing account with PUID {" "}
                  <strong>{conflict.client.puid}</strong>. The data you entered
                  differs from our records. Please confirm whether you want to
                  overwrite the stored values with your entries.
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
                    <div className="text-sm mt-2">
                      {conflict.client.full_name || "—"}
                    </div>
                    <div className="text-sm mt-2">
                      {conflict.client.email || "—"}
                    </div>
                    <div className="text-sm mt-2">
                      {conflict.client.role || "—"}
                    </div>
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
          )} */}
        </div>
      )}
    </div>
  );
};

export default EditForm;
