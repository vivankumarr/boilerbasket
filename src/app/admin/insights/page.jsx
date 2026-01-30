import { getAllAppointments, getAllClients, getLastYearAppts, getPredictions } from "./actions.js";
import Dashboard from "./Dashboard.jsx";
import { checkAdminAccess } from "@/lib/supabase/checkAdmin.js";
import { toZonedTime } from 'date-fns-tz';
import { format, isAfter } from 'date-fns';

const TIME_ZONE = 'America/Indiana/Indianapolis';

export default async function page () {
  await checkAdminAccess()

  const allAppointments = await getAllAppointments();
  const allClients = await getAllClients();
  const lastYearAppts = await getLastYearAppts();
  const predictions = await getPredictions();

  const prediction_data = makePredData(predictions);
  const arrange = arrangePredictionData(predictions);

  const numberOfDays = getDays(allAppointments);
  const average = numberOfDays > 0 
    ? (allAppointments.length / numberOfDays).toPrecision(3) 
    : 0;
  const average_visit_duration = averageVisitDuration(allAppointments);

  let best_time = peakHours(allAppointments);
  let best_hour = "N/A";
  let ampm = "";

  if (best_time.best) {
    // Expected format from peakHours is "5:00 PM"
    const parts = best_time.best.split(' ');
    best_hour = parts[0] + " ";
    ampm = parts[1];
  }

  const counts = getRoleDistribution(allClients);

  const dateTrends = getTrends(lastYearAppts);
  var monthNames = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
  const ordered_months = orderMonths(monthNames, dateTrends);

  return (
    <>
      <Dashboard
      length = {allAppointments.length}
      days={numberOfDays}
      freq={best_time.freq}
      average = {average}
      best_hour = {best_hour}
      ampm = {ampm}
      counts = {counts}
      ordered_months = {ordered_months}
      avg_duration = {average_visit_duration.val}
      visits={average_visit_duration.total}
      pred={prediction_data}
      arrangePrediction = {arrange}
      ></Dashboard>
    </>
  )
}

// function to find the number of different days we have recorded
function getDays(data) {
  const map = new Map();
  let num_days = 0;
  
  for (let i = 0; i < data.length; i++) {
    // Convert UTC timestamp to Indiana Date Object
    const zonedDate = toZonedTime(data[i].appointment_time, TIME_ZONE);
    const dateStr = format(zonedDate, 'yyyy-MM-dd');
    
    if (!map.has(dateStr)) {
      map.set(dateStr, true);
      num_days++;
    }
  }
  return num_days;
}

// function that returns the most frequently booked hour (truncating the minutes)
// converted to Indiana timezone before extracting the hour (prevents it from displaying as UTC)
// This Indiana <-> UTC thing is implemented across project now so I'll stop commenting on it
function peakHours(data) {
  const map = new Map();
  
  for (let i = 0; i < data.length; i++) {
    const zonedDate = toZonedTime(data[i].appointment_time, TIME_ZONE);
    const hourStr = format(zonedDate, 'h:00 a');

    if (!map.has(hourStr)) {
      map.set(hourStr, 1);
    }
    else {
      map.set(hourStr, map.get(hourStr) + 1);
    }
  }

  let max = 0;
  let best_hour = null;

  for (const [key, value] of map) {
    if (value > max) {
      best_hour = key;
      max = value;
    }
  }
  return {best: best_hour, freq: max};
}

//function that returns the frequencies of roles
function getRoleDistribution(data) {
  let student = 0;
  let staff = 0;
  let faculty = 0;
  for (let i = 0; i < data.length; i++) {
    let role = data[i].role;
    if (!role) {
      continue;
    }

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


// This function parses the Data from the Appointments for the Line Graph
function getTrends(data) {
  const canceledData = new Array(12).fill(0);
  const completedData = new Array(12).fill(0);
  const totalData = new Array(12).fill(0);

  const nowUTC = new Date();
  const nowIndiana = toZonedTime(nowUTC, TIME_ZONE);

  for (let i = 0; i < data.length; i++) {
    const zonedDate = toZonedTime(data[i].appointment_time, TIME_ZONE);
    if (isAfter(zonedDate, nowIndiana)) {
      continue;
    }
    const monthIndex = zonedDate.getMonth();
    
    if (data[i].status === 'Completed') {
      completedData[monthIndex]++;
    }
    else if (data[i].status === 'Canceled') {
      canceledData[monthIndex]++;
    }
    if (data[i].status !== 'Scheduled') {
      totalData[monthIndex]++;
    }
  }
  return {canceled: canceledData, completed: completedData, total: totalData};
}

// This function orders the last 12 months (including the current month), in descending order
// Used to put the data in a useful format for ChartJS LineGraph
function orderMonths(months, month_data) {
  const nowUtc = new Date();
  const nowIndiana = toZonedTime(nowUtc, TIME_ZONE);
  const currentMonthIndex = nowIndiana.getMonth();
  
  let index = (currentMonthIndex + 1) % 12;
  
  const retmonths = new Array(12);
  const orderedCanceled = new Array(12);
  const orderedCompleted = new Array(12);
  const orderedTotal = new Array(12);

  for (let i = 0; i < 12; i++) {
    retmonths[i] = months[index];
    orderedCanceled[i] = month_data.canceled[index];
    orderedCompleted[i] = month_data.completed[index];
    orderedTotal[i] = month_data.total[index];
    index++;
    index %= 12;
  }

  return {month: retmonths, canceled: orderedCanceled, completed: orderedCompleted, total: orderedTotal};
}

function averageVisitDuration(data) {
  let count = 0;
  let totalMinutes = 0;

  for (let i = 0; i < data.length; i++) {
    if (data[i].check_in_time == null || data[i].check_out_time == null) continue;
    const end = new Date(data[i].check_out_time);
    const start = new Date(data[i].check_in_time);
    totalMinutes += (end-start) / 60000;
    count++;
  }
  if (count == 0) return { val: 0, total: 0 };
  return { val: (totalMinutes / count).toPrecision(3), total: count };
}

function makePredData(predictions) {
  for (let i = 0; i < predictions.length; i++) {
    predictions[i].day = getDayOfWeekCode(predictions[i].prediction_date);
  }
  return predictions;
}

function getDayOfWeekCode(dateStr) {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
  
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
  
    return days[date.getDay()];
}

function arrangePredictionData(data) {
  const prediction_len = data.length;
  const actualArray = new Array(prediction_len);
  const lowerArray = new Array(prediction_len);
  const upperArray = new Array(prediction_len);
  const labels = new Array(prediction_len);

  for (let i = 0; i < prediction_len; i++) {
    actualArray[i] = data[i].predicted_count;
    lowerArray[i] = data[i].confidence_lower;
    upperArray[i] = data[i].confidence_upper;
    const [year, month, date] = data[i].prediction_date.split("-");
    labels[i] = `${month}-${date}`;
  }

  return {label: labels, actual: actualArray, lower: lowerArray, upper: upperArray};
}

export const metadata = {
  title: "Insights | BoilerBasket",
};