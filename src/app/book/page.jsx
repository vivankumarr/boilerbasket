import React from 'react'
import Navbar from '../../components/book/Navbar.jsx';
import Form from '../../components/book/Form.jsx';
import HowItWorks from '../../components/book/HowItWorks.jsx';

import { supabaseService } from '@/lib/supabase/service';

export default async function bookingPage () {
  
  const avaliableSlots = await calculateEffectiveSlots();

  return (
    <>
      <div className="no-scrollbar min-h-screen flex flex-col items-center bg-gradient-to-br from-amber-100 via-purple-100 to-slate-100">
        <Navbar />
        <span className="text-black font-medium text-5xl mt-10 text-center">
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
    client.
*/

function makeSlots(blockedTimes, existingAppts) {
  const slots = [];

  const today = new Date();
  const nextMonth = new Date();
  nextMonth.setMonth(today.getMonth() + 1);

  //possible time slots, every 30 min
  const timeSlotsTuesday = ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'];
  const timeSlotsSunday = ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'];

  //max number of people we can have per time slot
  const maxPerTimeSlot = 5;

  //lets use iso strings to compare better
  const booked = existingAppts.map(appt => 
    new Date(appt.appointment_time).toISOString()
  );

  //iterate through all dates from today -> next month
  for (let d = new Date(today); d <= nextMonth; d.setDate(d.getDate() + 1)) {
    const workingDate = new Date(d);
    const isolateDate = workingDate.toISOString().split('T')[0];
    const day = workingDate.getDay();

    //if the day is not a sunday or tuesday, then skip
    if (day != 0 && day != 2) continue;

    //if at least one blocked date blocks, then skip
    const isBlocked = blockedTimes.some(period => {
      const start = new Date(period.start_date).toISOString();
      const end = new Date(period.end_date).toISOString();

      const startDate = start.split('T')[0];
      const endDate = end.split('T')[0];

      return isolateDate >= startDate && isolateDate <= endDate;
    });

    if (isBlocked) continue;

    let timeSlots = (day == 0 ? timeSlotsSunday : timeSlotsTuesday);

    //for each time slot do the following
    timeSlots.forEach(time => {
      const [hours, minutes] = time.split(':').map(Number);

      const currSlotDate = new Date(isolateDate);
      currSlotDate.setHours(hours, minutes, 0, 0);
      const slotTime = currSlotDate.toISOString();

      //now find the number of appointments that match the configured time slot
      const count = booked.filter(
        timestamp => timestamp == slotTime
      ).length;

      if (maxPerTimeSlot - count > 0) {
        const period = hours >= 12 ? 'PM' : 'AM';

        //make sure we always have two places for minutes (although this won't be an issue with current time slots)
        const displayMinutes = minutes.toString().padStart(2, '0');

        //other formatting formalities
        let displayHours = hours;
        if (displayHours > 12) displayHours -= 12;
        if (displayHours === 0) displayHours = 12;

        const display = `${displayHours}:${displayMinutes} ${period}`;

        //the resultant array will have the following:
        // date: YYYY-MM-DD
        // time: XX:YY AM/PM
        // timestamp: YYYY-MM-DDTXX:YY
        // Sunday or Tuesday
        slots.push({
          date: isolateDate,
          time: display,
          timestamp: slotTime,
          day: day === 0 ? 'Sunday' : 'Tuesday'
        })
      }
    })
  }
  return slots;
}

// TODO: Whoever wrote this page should refactor this export into the main component
// We need the data for editing functionality
export async function calculateEffectiveSlots() {
  const supabase = supabaseService;
  const now = new Date().toISOString();

  //fetch blocked times data from supabase (things like holidays, days off, etc..)
  const {data: blockedTimes, errorblockedtimes} = await supabase 
    .from('blocked_periods')
    .select('*')
    .order('start_date', {ascending: true});

  //fetch appointments already made from supabase
  const {data: existingAppts, errorexistingappts } = await supabase
    .from('appointments')
    .select('appointment_time')
    .gte('appointment_time', now)

  //log the errors if applicable
  if (errorblockedtimes) {
    console.error('Error fetching from blocked times: ', errorblockedtimes);
  }
  if (errorexistingappts) {
    console.error('Error fetching existing appointments: ', errorexistingappts);
  } 

  //generate avaliable appointment times
  return makeSlots(blockedTimes || [], existingAppts || []);
}

export const metadata = {
  title: 'BoilerBasket | Book Appointment',
  description: 'Book an appointment at ACE Food Pantry'
}

