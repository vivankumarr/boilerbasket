import StatCard from "@/components/StatCard.jsx"
import { Calendar, FileInput, Clock, Sigma } from "lucide-react";

export default async function page () {

//     const supabase = createServerComponent({cookies});
//     const now = new Date().toISOString();

//     const{data: appointments, errorAppointments} = await supabase
//         .from{"appointments"}
//         .select{"*"}

    return (
       <>
            <div className="justify-center space-x-13 flex flex-row">
                <StatCard title={"Today"} icon={<Calendar />} iconBg={"bg-amber-100"}
                 value={1}/>
                <StatCard title={"Checked In"} icon={<FileInput />} iconBg={"bg-lime-200"}
                value={2}/>
                <StatCard title={"Upcoming"} icon={<Clock />} iconBg={"bg-orange-200"}
                value={3}/>
                <StatCard title={"Total This Week"} icon={<Sigma />} iconBg={"bg-fuchsia-200"}
                value={4}/>

            </div>
       </>
    )
}

export const metadata = {
  title: 'BoilerBasket | Appointments',
  description: 'Track and manage client appointments'
}