import { getAllAppointments, getAllClients, getLastYearAppts, getPredictions } from "./actions.js";
import Dashboard from "./Dashboard.jsx";

export default async function page () {
  const allAppointments = await getAllAppointments();
  const allClients = await getAllClients();
  const lastYearAppts = await getLastYearAppts();
  const predictions = await getPredictions();

  const prediction_data = makePredData(predictions);
  const arrange = arrangePredictionData(predictions);


  const numberOfDays = getDays(allAppointments);
  const average = (numberOfDays / allAppointments.length).toPrecision(2);
  const average_visit_duration = averageVisitDuration(allAppointments);


  let best_time = peakHours(allAppointments);
  const best_hour = best_time.best.split(' ')[0] + ":00 ";
  const ampm = best_time.best.split(' ')[1];

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

  let max = 0;
  let best_hour;

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


// This function parses the Data from the Appointments for the Line Graph,
//
function getTrends(data) {
  const canceledData = new Array(12).fill(0);
  const completedData = new Array(12).fill(0);
  const totalData = new Array(12).fill(0);

  for (let i = 0; i < data.length; i++) {
    const month = new Date(data[i].appointment_time).toLocaleString().split('/')[0];
    if (data[i].status == 'Completed') {
      completedData[parseInt(month)-1]++;
    }
    else if (data[i].status == 'Canceled') {
      canceledData[parseInt(month)-1]++;
    }

    if (data[i].status != 'Scheduled') {
      totalData[parseInt(month)-1]++;
    }
  }
  return {canceled: canceledData, completed: completedData, total: totalData};
}

// This function orders the last 12 months (including the current month), in descending order
// Used to put the data in a useful format for ChartJS LineGraph
function orderMonths(months, month_data) {
  const now = new Date().getMonth();
  let index = (now + 1) % 12;
  const retmonths = new Array(12);
  const retdata = new Array(12);

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
  if (count == 0) return 0;
  return {val: (totalMinutes / count).toPrecision(3), total: count};
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


