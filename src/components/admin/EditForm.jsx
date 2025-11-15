"use client";

import { useState, useEffect } from "react";
import { confirmBooking } from "@/app/book/actions";
import { useRouter } from "next/navigation";
import { usePopup } from "./ScheduleAppointmentPopupContext";

const EditForm = ({ previousData, showPopup, setShowPopup }) => {

  const [name, setName] = useState(previousData?.full_name || "");
  const [puid, setPuid] = useState(previousData?.puid || "");
  const [email, setEmail] = useState(previousData?.email || "");
  const [role, setRole] = useState(previousData?.role || "");

  useEffect(() => {
    if (previousData) {
      setName(previousData.full_name || "");
      setEmail(previousData.email || "");
      setRole(previousData.role || "");
      setPuid(previousData.puid || "");
    }
  }, [previousData]);


  // shows error message for booking form
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);

  // booking form submission logic
  async function submitBooking(force_update = false) {
    setMessage(null);
    setSuccess(false);

    // basic client-side validation
    if (!puid || puid.trim() === "") {
      setMessage("PUID is required.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: name.trim() || null,
        puid: String(puid).trim(),
        email: email ? String(email).trim().toLowerCase() : null,
        role: role || null,
        appointment_timestamp: new Date().toISOString(), // ISO string expected by server
        force_update,
      };

      const result = await confirmBooking(payload);

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
      name_input.value = "";
      puid_input.value = "";
      email_input.value = "";
      setShowPopup(false);
    } catch (err) {
      setMessage("Unexpected error: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white shadow-xl w-120 p-6 mt-10 mb-10 rounded-xl flex flex-col relative z-50">
            <span className="text-2xl font-bold">Book Your Appointment</span>
            <span className="text-sm text-slate-500 mb-1 mt-1">
              Fill in your details below
            </span>

            <div className="flex flex-col items-center">
              <div className="grid grid-cols-2 grid-rows-2 gap-5 mt-4 w-full">
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
              </div>
                  
              <button
                disabled={loading}
                onClick={() => submitBooking(false)}
                className="mt-8 bg-purple-600 hover:bg-purple-700 py-3 px-6 rounded-lg w-full text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transform transition-transform duration-300"
              >
                {loading ? "Booking..." : "Confirm Booking"}
              </button>

              <button
                disabled={loading}
                onClick={() => setShowPopup(false)}
                className="mt-8 bg-purple-600 hover:bg-purple-700 py-3 px-6 rounded-lg w-full text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transform transition-transform duration-300"
              >
                {loading ? "Booking..." : "Cancel"}
              </button>

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
