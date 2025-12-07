import { getAllAppointments, getAllClients, getLastYearAppts } from "./actions.js";
import Dashboard from "./Dashboard.jsx";

export default async function page () {
  const allAppointments = await getAllAppointments();
  const allClients = await getAllClients();
  const lastYearAppts = await getLastYearAppts();

  const average = (getDays(allAppointments) / allAppointments.length).toPrecision(2);

  let best_time = peakHours(allAppointments);
  const best_hour = best_time.split(' ')[0] + ":00 ";
  const ampm = best_time.split(' ')[1];

  const counts = getRoleDistribution(allClients);

  const dateTrends = getTrends(lastYearAppts);
  var monthNames = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
  const ordered_months = orderMonths(monthNames, dateTrends);

  return (
    <>
      <Dashboard
      length = {allAppointments.length}
      average = {average}
      best_hour = {best_hour}
      ampm = {ampm}
      counts = {counts}
      ordered_months = {ordered_months}
      ></Dashboard>
    </>
  )
}

// function to find the number of different days we have recorded
// TODO: This only takes into account days we have data on, will change this later
// to take into days where no one shows up, taking into account holidays / blocked dates.

function getDays(data) {
  const map = new Map();
  let num_days = 0;
  for (let i = 0; i < data.length; i++) {
    const date = data[i].appointment_time.split('T')[0];
    if (!map.has(date)) {
      map.set(date, true);
      num_days++;
    }
  }
  return num_days;
}

// function that returns the most frequently booked hour (truncating the minutes)
function peakHours(data) {
  const map = new Map();
  for (let i = 0; i < data.length; i++) {
    const local_time = new Date(data[i].appointment_time).toLocaleString();
    const hour = local_time.split(' ')[1].split(':')[0];
    const ampm = local_time.split(' ')[2];
    const join = hour + ' ' + ampm;
    if (!map.has(join)) {
      map.set(join, 1);
    }
    else {
      map.set(join, map.get(join) + 1);
    }
  }

  let max = Number.MIN_SAFE_INTEGER;
  let best_hour;

  for (const [key, value] of map) {
    if (value > max) {
      best_hour = key;
      max = value;
    }
  }
  return best_hour;
}

//function that returns the frequencies of roles
function getRoleDistribution(data) {
  let student = 0;
  let staff = 0;
  let faculty = 0;
  for (let i = 0; i < data.length; i++) {
    let role = data[i].role;
    switch(role) {
      case('Student'):
        student++;
        break;
      case('Faculty'):
        faculty++;
        break;
      case('Staff'):
        staff++;
        break;
      default:
        break;
    }
  }
  return [student, staff, faculty];
}

function getTrends(data) {
  const datedata = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let i = 0; i < data.length; i++) {
    const date = new Date(data[i].appointment_time).toLocaleString().split('/')[0];
    datedata[parseInt(date) - 1]++;
  }
  return datedata;
}

function orderMonths(months, month_data) {
  const now = new Date().getMonth();
  let index = (now + 1) % 12;
  const retmonths = new Array(12);
  const retdata = new Array(12);
  for (let i = 0; i < 12; i++) {
    retmonths[i] = months[index];
    retdata[i] = month_data[index];
    index++;
    index %= 12;
  }
  return {month: retmonths, month_data: retdata};
}


