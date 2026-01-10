"use client";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Clock9Icon, CalendarDaysIcon, ChartColumn, UsersIcon, DownloadIcon, LogOutIcon, CircleX } from "lucide-react";
import SidebarTabAdmin from "./SidebarTabAdmin";

const sidebarDiv = 'font-medium pt-1'
const tabDiv = 'flex \
				my-3 mx-4 pl-1 \
				w-[calc(full)] \
				border-2 border-amber-50 \
				rounded-md \
				hover:border-amber-400 hover:bg-amber-200'
const tabVariants = {
		true: tabDiv.concat(' bg-yellow-100 \
							text-yellow-600 \
							border-2 border-yellow-500 \
							rounded-md'),
		false: tabDiv,
};
const innerDiv = 'flex gap-2 \
					py-2 px-2 \
					w-100'

export default function SidebarAdmin() {
	const pathname = usePathname();
	const router = useRouter();

	async function handleLogout() {
		const { error } = await supabase.auth.signOut();

		if (error) {
			alert('Logout failed. Please try again.');
		} else {
			router.refresh(); 
			router.push('/login');
		}
	}

	return (
		<div className={sidebarDiv}>
			<div>
				<SidebarTabAdmin
					link={'/admin/appointments'}
					tabDiv={tabVariants[pathname == '/admin/appointments']}
					innerDiv={innerDiv} 
					logo={<CalendarDaysIcon />}
					label={'Appointments'} 
				/>
				<SidebarTabAdmin
					link={'/admin/insights'}
					tabDiv={tabVariants[pathname == '/admin/insights']}
					innerDiv={innerDiv} 
					logo={<ChartColumn />}
					label={'Insights'} 
				/>
				<SidebarTabAdmin
					link={'/admin/clients'}
					tabDiv={tabVariants[pathname == '/admin/clients']}
					innerDiv={innerDiv} 
					logo={<UsersIcon />}
					label={'Clients'} 
				/>
				<SidebarTabAdmin
					link={'/admin/exports'}
					tabDiv={tabVariants[pathname == '/admin/exports']}
					innerDiv={innerDiv} 
					logo={<DownloadIcon />}
					label={'Export Data'} 
				/>
				<SidebarTabAdmin
					link={'/admin/closures'}
					tabDiv={tabVariants[pathname == '/admin/closures']}
					innerDiv={innerDiv} 
					logo={<CircleX />}
					label={'Closures'} 
				/>
			</div>

			<div className="flex my-3 mx-4 pl-1 border-2 border-amber-50 rounded-md hover:border-red-400 hover:bg-red-100">
				<button onClick={handleLogout} className="flex gap-2 py-2 px-2 w-full text-red-600 transition cursor-pointer">
					<LogOutIcon/>
					<span>Logout</span>
				</button>
			</div>
		</div>
	)
};