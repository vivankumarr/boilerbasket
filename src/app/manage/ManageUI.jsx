'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import { cancelAppointment, rescheduleAppointment } from './actions';
import { formatInTimeZone } from 'date-fns-tz';

export default function ManageUI({ appointment, availableSlots }) {
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const router = useRouter();

  const handleCancel = async () => {
    if(!confirm("Are you sure you want to cancel?")) return;
    setLoading(true);
    const res = await cancelAppointment(appointment.edit_token);
    setLoading(false);
    if (res.success) {
      router.refresh(); // Reloads page to show the "Canceled" status
    } else {
      setMessage({ type: 'error', text: res.error });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleReschedule = async (newTime) => {
    setLoading(true);
    const res = await rescheduleAppointment(appointment.edit_token, newTime);
    setLoading(false);
    if (res.success) {
      setIsRescheduling(false);
      setMessage({ type: 'success', text: 'Appointment updated!' });
      setTimeout(() => setMessage(null), 3000);
      router.refresh();
    } else {
      setMessage({ type: 'error', text: res.error });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const isCanceled = appointment.status === 'Canceled';
  const TIME_ZONE = 'America/Indiana/Indianapolis';

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
      
      {/* Display appointment status */}
      <div className={`p-4 text-center font-bold text-white ${isCanceled ? 'bg-red-500' : 'bg-purple-900'}`}>
        {isCanceled ? 'Appointment Canceled' : 'Your Upcoming Appointment'}
      </div>

      <div className="p-8">
        {message && (
          <div className={`p-4 mb-6 rounded-lg ${message.type === 'error' ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
            {message.text}
          </div>
        )}

        {/* Details card */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-center gap-4 text-gray-700">
            <Calendar className="w-6 h-6 text-purple-600" />
            <span className="text-xl font-medium">
              {formatInTimeZone(appointment.appointment_time, TIME_ZONE, "EEEE, MMMM d")}
            </span>
          </div>
          <div className="flex items-center gap-4 text-gray-700">
            <Clock className="w-6 h-6 text-purple-600" />
            <span className="text-xl font-medium">
              {formatInTimeZone(appointment.appointment_time, TIME_ZONE, "h:mm a")}
            </span>
          </div>
          <div className="flex items-center gap-4 text-gray-700">
            <MapPin className="w-6 h-6 text-purple-600" />
            <span className="text-xl font-medium">ACE Campus Food Pantry (200 N Russell St)</span>
          </div>
        </div>

        {/* Action buttons */}
        {!isRescheduling && !isCanceled && (
          <div className="flex gap-4">
            <button 
              onClick={() => setIsRescheduling(true)}
              className="flex-1 py-3 border-2 border-purple-900 text-purple-900 font-bold rounded-lg hover:bg-purple-50 transition cursor-pointer"
            >
              Reschedule
            </button>
            <button 
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 py-3 border-2 border-red-500 text-red-500 font-bold rounded-lg hover:bg-red-50 transition cursor-pointer"
            >
              {loading ? 'Processing...' : 'Cancel Appointment'}
            </button>
          </div>
        )}

        {/* Reschedule view */}
        {isRescheduling && (
          <div className="mt-6 border-t pt-6">
            <h3 className="font-bold text-lg mb-4">Select New Time</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-1">
              {availableSlots.slice(0,72).map((slot) => (
                <button
                  key={slot.timestamp}
                  onClick={() => handleReschedule(slot.timestamp)}
                  disabled={loading}
                  className="px-4 py-3 text-sm font-medium rounded-lg border border-slate-400 bg-white text-slate-700 transition-all cursor-pointer hover:shadow-md hover:border-purple-400 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <div className="font-bold">{slot.time}</div>
                  <div className="text-xs text-gray-500">{slot.day}, {new Date(slot.date).toLocaleDateString(undefined, {month:'short', day:'numeric'})}</div>
                </button>
              ))}
            </div>
            <button 
              onClick={() => setIsRescheduling(false)}
              className="mt-4 text-gray-500 underline text-sm cursor-pointer"
            >
              Keep Original Time
            </button>
          </div>
        )}

        {/* Reactivate Canceled Appointment */}
        {isCanceled && (
          <div className="text-center">
            <p className="text-gray-500 mb-4">Did you cancel by mistake?</p>
            <button 
              onClick={() => setIsRescheduling(true)}
              className="px-6 py-2 bg-purple-900 text-white rounded-lg hover:bg-purple-800 cursor-pointer"
            >
              Book New Time
            </button>
          </div>
        )}
      </div>
    </div>
  );
}