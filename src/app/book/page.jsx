import React from 'react'
import Navbar from './Navbar.jsx';
import Form from './Form.jsx';
import HowItWorks from './HowItWorks.jsx';
import { addMonths, eachDayOfInterval, isSameDay, set, isBefore, addDays } from 'date-fns';
import { fromZonedTime, toZonedTime, format } from 'date-fns-tz';

import { supabaseService } from '@/lib/supabase/service';
export const dynamic = 'force-dynamic';

export default async function bookingPage () {
  
  const avaliableSlots = await calculateEffectiveSlots();

  return (
    <>
      <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-amber-100 via-purple-100 to-slate-100">
        <Navbar />
        <span className="text-black font-medium text-3xl md:text-5xl mt-6 md:mt-10 text-center">
          Schedule Your Visit to<br />
          <span className="font-bold text-purple-900">ACE Campus Food Pantry</span>
        </span>
        <a
          href="https://acefoodpantry.wixsite.com/website"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="btn mt-10 text-xl border px-6 py-2 rounded-md hover:scale-105 hover:bg-purple-900 hover:text-white transition transform duration-200">
            Learn More
          </button>
        </a>
        <Form timeSlots={avaliableSlots} />
        <HowItWorks />
      </div>
    </>
  )
}

/* 
    Function that takes blocked times and existing appointments,
    filters out times in the next month that are blocked or are taken,
    then returns a list of objects that contain valid time slots for
    client. Define slot in Indiana time, then convert to UTC for storage.
*/
function makeSlots(blockedTimes, existingAppts) {
  const slots = [];
  const timeZone = 'America/Indiana/Indianapolis';
  
  // Get "Now" relative to Indiana, then set range (today -> next month, but needs to be changed for custom
  const nowUtc = new Date();
  const nowInIndiana = toZonedTime(nowUtc, timeZone);
  const nextMonth = addMonths(nowInIndiana, 1);
  
  // Possible time slots
  const timeSlotsTuesday = ['12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45'];
  const timeSlotsSunday = ['17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45'];
  
  const maxPerTimeSlot = 5;
  
  // Normalize existing appointments to ISO strings
  const booked = existingAppts.map(appt => 
    new Date(appt.appointment_time).toISOString()
  );
  
  // Iterate days
  for (let d = nowInIndiana; isBefore(d, nextMonth); d = addDays(d, 1)) {
    const day = d.getDay(); // 0 = Sunday, 2 = Tuesday
    if (day !== 0 && day !== 2) continue;

    const dateString = format(d, 'yyyy-MM-dd');
    
    // Compare YYYY-MM-DD strings directly for blocked date logic
    const isBlocked = blockedTimes.some(period => 
      dateString >= period.start_date && dateString <= period.end_date
    );
    
    if (isBlocked && isBlocked === true) { 
    }
    const finalBlockedStatus = isBlocked;

    let timeSlots = (day === 0 ? timeSlotsSunday : timeSlotsTuesday);
    
    timeSlots.forEach(time => {
      const [hours, minutes] = time.split(':').map(Number);
      
      // Specific date + specific time @ Indiana time
      const timeOnDate = set(d, { hours, minutes, seconds: 0, milliseconds: 0 });
      
      // Convert Indiana time back to UTC timestamp
      const utcDate = fromZonedTime(timeOnDate, timeZone);
      const slotTimestamp = utcDate.toISOString();

      // Check capacity
      const count = booked.filter(t => t === slotTimestamp).length;
      
      if (maxPerTimeSlot - count > 0) {
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayMinutes = minutes.toString().padStart(2, '0');
        let displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
        const displayTime = `${displayHours}:${displayMinutes} ${period}`;
        
        slots.push({
          date: format(d, 'MM/dd'),
          time: displayTime,
          timestamp: slotTimestamp,
          day: format(d, 'EEEE'),
          block: finalBlockedStatus
        })
      }
    })
  }
  return slots;
}

export async function calculateEffectiveSlots() {
  const supabase = supabaseService;
  const now = new Date().toISOString();

  //fetch blocked times data from supabase (things like holidays, days off, etc..)
  const {data: blockedTimes, error: errorblockedtimes} = await supabase 
    .from('blocked_periods')
    .select('*')
    .order('start_date', {ascending: true});

  //fetch appointments already made from supabase
  const {data: existingAppts, error: errorexistingappts} = await supabase
    .from('appointments')
    .select('appointment_time')
    .gte('appointment_time', now)

    //log the errors if applicable
  if (errorblockedtimes) {
    console.error('Error fetching blocked times: ', errorblockedtimes);
  }
  if (errorexistingappts) {
    console.error('Error fetching existing appointments: ', errorexistingappts); 
  }

  return makeSlots(blockedTimes || [], existingAppts || []);
}

export const metadata = {
  title: 'Book Appointment | BoilerBasket'
}