import { CalendarDaysIcon, ChartColumn, UsersIcon, DownloadIcon, SettingsIcon } from 'lucide-react'

const sidebarDiv = 'font-medium'
const tabDiv = 'flex gap-2 m-4 p-2 border'

// TODO: Make clickable (link), change color upon hover, indicate current tab

const SidebarAdmin = () => {
	return (
		<div className={sidebarDiv}>
			<div className={tabDiv}>	
				<CalendarDaysIcon />
				<span>Appointments</span>
			</div>
			<div className={tabDiv}>	
				<ChartColumn />
				<span>Insights</span>
			</div>
			<div className={tabDiv}>	
				<UsersIcon />
				<span>Clients</span>
			</div>
			<div className={tabDiv}>	
				<DownloadIcon />
				<span>Export Data</span>
			</div>
			<div className={tabDiv}>	
				<SettingsIcon />
				<span>Settings</span>
			</div>
		</div>
	)
};

export default SidebarAdmin;