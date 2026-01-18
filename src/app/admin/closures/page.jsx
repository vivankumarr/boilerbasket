import UI from "./UI.jsx";
import { fetchBlockedDates } from "./actions.js"

export default async function Page() {
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