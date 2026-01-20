import UI from "./UI.jsx";
import { fetchBlockedDates } from "./actions.js"
import { checkAdminAccess } from "@/lib/supabase/checkAdmin.js";

export default async function Page() {
  await checkAdminAccess()
  const dates = await fetchBlockedDates();
  
  return (
    <>
      <UI dates={dates}/>
    </>
  )
}

export const metadata = {
  title: "Closures | BoilerBasket",
};