"use client";

import { useState, useEffect } from "react";
import { editAppointment } from "@/app/admin/appointments/actions";
import { editClient } from "@/app/admin/clients/actions";

const EditForm = ({ apptId, context, previousData, showPopup, setShowPopup, timeSlots = [], currentTimestamp, onSuccess }) => {
  var editFormTitle = 'Edit Your Appointment';
  var editFormSubtitle = '';

  switch (context) {
	case "clients":
		editFormTitle = 'Edit Client';
		break;
	default:
		editFormSubtitle = "Select New Time Slot";
  }

  // Editable client details
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

  // Wipe memory each time the popup is opened
  useEffect(() => {
    if (showPopup) {
      setSuccess(false);
      setMessage(null);
      setLoading(false);
    }
  }, [showPopup]);

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
        blocked: slot.block,
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

  // booking form (edited) submission logic
  async function submitEditedBooking(force_update = false) {
    setMessage(null);
    setSuccess(false);

	if (role == '') {
	  setMessage("Role is required.");
	  return;
	}

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

	  var result;
	  var successMessage;

	  switch (context) {
		case "clients":
			result = await editClient(apptId, payload); // TODO
			successMessage = "Client updated successfully";
			break;
		default:
			result = await editAppointment(apptId, payload);
			successMessage = "Appointment updated successfully.";
	  }

      // Error
      if (!result.success) {
        setMessage(result.error || "An error occurred. Please try again.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setMessage(successMessage);

      // Give the user a moment to read the success message before close + refresh
      setTimeout(() => {
        setShowPopup(false);
        if (onSuccess) {
          onSuccess();
        }}, 1500);

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

  return (
    <div>
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white shadow-xl w-120 p-6 mt-10 mb-10 rounded-xl flex flex-col relative z-50">
            <span className="text-2xl font-bold">{editFormTitle}</span>
            <span className="text-sm text-slate-500 mb-1 mt-1">
              {editFormSubtitle}
            </span>			
            <div className="flex flex-col items-center">
              {/* Date selector */}
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
                      className={`hover:bg-slate-100 p-2 rounded-lg text-xl transition-all cursor-pointer ${
                        canSee.beg === 0 ? "invisible" : ""
                      }`}
                      type="button"
                    >
                      ᐸ
                    </button>
                    {visibleDates.map((dateSlot) => (
                    <div key={dateSlot.date}>
                      {dateSlot.blocked && 
                      <div >
                        <button className={`flex flex-col items-center border px-4 py-3 rounded-lg transition-all hover:shadow-md bg-gray-200 cursor-not-allowed`}>
                          <div className="text-xs font-medium">Closed</div>
                          <div className="text-sm font-semibold mt-0.5">{dateSlot.date.split('/')[0] + "/" + dateSlot.date.split('/')[1]}</div>
                        </button>
                      </div>
                      }
                      {!dateSlot.blocked && 
                        <div>
                          <button 
                      onClick={() => {date !== dateSlot.date ? setTime('') : null, setDate(dateSlot.date)}} 
                      
                      type = "button" 
                      className={`flex flex-col items-center border px-4 py-3 rounded-lg transition-all hover:shadow-md cursor-pointer ${date === dateSlot.date ? 'bg-purple-600 text-white border-purple-600' : 'hover:border-purple-400 bg-white'}`}>
                        <div className="text-xs font-medium">{dateSlot.day}</div>
                        <div className="text-sm font-semibold mt-0.5">{dateSlot.date.split('/')[0] + "/" + dateSlot.date.split('/')[1]}</div>
                    </button>
                        </div>
                      }
                    </div>
 
                  ))}
                    <button
                      onClick={() => moveVisibleDates(1)}
                      className={`hover:bg-slate-100 p-2 rounded-lg text-xl transition-all cursor-pointer ${
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
                          className={`px-5 py-2.5 text-sm font-medium rounded-lg border transition-all hover:shadow-md cursor-pointer ${
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

			  {context === "clients" && (
			  	<div className='w-full mt-8 h-30'>
					{/* TODO: Pencil icon, populate with existing data, edit option for one or more fields */}
					<label className="text-base font-medium text-slate-700 block mb-3">
						Full Name
					</label>
					<label className="text-base font-medium text-slate-700 block mb-3">
						E-Mail
					</label>
					<label className="text-base font-medium text-slate-700 block mb-3">
						PUID
					</label>
					{/* <label className="text-base font-medium text-slate-700 block mb-3">
						Role
					</label> */}
				</div>
			  )}

              <div className="mt-8 flex gap-3 w-full justify-between">

                <button
                disabled={loading}
                onClick={() => setShowPopup(false)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 py-3 px-6 rounded-lg flex-1 font-medium shadow-sm transition cursor-pointer"
                  >
                  Cancel
                </button>

                <button
                disabled={loading}
                onClick={() => submitEditedBooking(false)}
                className="bg-purple-600 hover:bg-purple-700 py-3 px-6 rounded-lg flex-1 text-white font-medium shadow-md hover:shadow-lg cursor-pointer"
              >
                {loading ? "Booking..." : "Save"}
                </button>


              </div>

              {!success && message && (
                <p className="mt-3 text-red-600">{message}</p>
              )}
              {success && <p className="mt-3 text-green-700">{message}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditForm;
