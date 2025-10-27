"use client";
import { usePathname } from "next/navigation";
import TopbarAdmin from "./TopbarAdmin";

const ConditionalTopbarAdmin = () => {
	const pathname = usePathname();
	const pathname_admin = '/admin/';

	var titleText = null;
	var subtitleText = null;

	switch (pathname) {
		case pathname_admin.concat('appointments'):
			titleText = 'Appointments'
			subtitleText = 'Track and manage client appointments'
			break;

		case pathname_admin.concat('insights'):
			titleText = 'Data Insights'
			subtitleText = 'Track performance metrics and demand predictions'
			break;

		case pathname_admin.concat('clients'):
			titleText = 'Client Management'
			subtitleText = 'Manage client information and visit history'
			break;

		case pathname_admin.concat('exports'):
			titleText = 'Export Data'
			subtitleText = 'Download pantry data from any time period for analysis'
			break;

		case pathname_admin.concat('settings'):
			titleText = 'Settings'
			subtitleText = 'Manage closures and preferences'
			break;

		default:
			titleText = 'titleText'
			subtitleText = 'subtitleText'
			break;
	}

	return <TopbarAdmin title={titleText} subtitle={subtitleText} />;
};

export default ConditionalTopbarAdmin;