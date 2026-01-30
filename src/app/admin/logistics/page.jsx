import UI from "./UI.jsx";
import { fetchBlockedDates, getCap, getVisible, validateTimeSlots } from "./actions.js"
import { checkAdminAccess } from "@/lib/supabase/checkAdmin.js";
export const dynamic = 'force-dynamic';
import { calculateEffectiveSlots } from "@/app/book/page";

export default async function Page() {
  await checkAdminAccess()
  const dates = await fetchBlockedDates();
  const cap = await getCap();
  const Visible = await getVisible();
  // const timeSlots = await calculateEffectiveSlots();
  // const actualSlots = await validateTimeSlots(timeSlots, cap);



  // const dateToTimesMap = timeSlots.reduce((acc, slot) => {
  //   if (!acc[slot.date]) {
  //     acc[slot.date] = {
  //       date: slot.date,
  //       day: slot.day,
  //       displayDate: new Date(slot.date).toLocaleDateString("en-US", {
  //         weekday: "short",
  //         month: "short",
  //         day: "numeric",
  //       }),
  //       times: [],
  //       blocked: slot.block,
  //     };
  //   }
  //   acc[slot.date].times.push(slot);
  //   return acc;
  // }, {});

  // const shownDates = Object.values(dateToTimesMap);
  
 
  
  return (
    <>
      <UI dates={dates} cap = {cap} visibleDays = {Visible}/>
    </>
  )
}

export const metadata = {
  title: "Closures | BoilerBasket",
};