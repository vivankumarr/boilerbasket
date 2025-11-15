"use client";
import { usePathname, useRouter } from "next/navigation";
import { UserRoundPlus, Plus } from "lucide-react";
import { usePopup } from "./ScheduleAppointmentPopupContext";

const buttonDiv =
  "flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white font-medium py-2.5 px-5 rounded-lg shadow-md transition";

const TopbarAdmin = () => {
  // const router = useRouter();

  const pathname = usePathname();
  const pathname_admin = "/admin/";

  const { showPopup, setShowPopup } = usePopup();

  var titleText = null;
  var subtitleText = null;

  switch (pathname) {
    case pathname_admin.concat("appointments"):
      titleText = "Appointments";
      subtitleText = "Track and manage client appointments";
      break;

    case pathname_admin.concat("insights"):
      titleText = "Data Insights";
      subtitleText = "Track performance metrics and demand predictions";
      break;

    case pathname_admin.concat("clients"):
      titleText = "Client Management";
      subtitleText = "Manage client information and visit history";
      break;

    case pathname_admin.concat("appointments/schedule"):
      titleText = "Schedule Appointment";
      subtitleText =
        "Schedule a new immediate appointment for a walk-in client";
      break;

    case pathname_admin.concat("exports"):
      titleText = "Export Data";
      subtitleText = "Download pantry data from any time period for analysis";
      break;

    case pathname_admin.concat("settings"):
      titleText = "Settings";
      subtitleText = "Manage closures and preferences";
      break;

    default:
      titleText = "titleText";
      subtitleText = "subtitleText";
      break;
  }

  return (
    <div className="flex items-start justify-between px-6 p-2 border-0 w-full">
      <div className="grid">
        <span className="font-bold text-lg">{titleText}</span>
        <span>{subtitleText}</span>
      </div>

      {pathname === pathname_admin.concat("clients") && (
        <button className={buttonDiv}>
          <UserRoundPlus />
          <span>Add Client</span>
        </button>
      )}

      {pathname === pathname_admin.concat("appointments") && (
        <button onClick={() => {setShowPopup(true); console.log("clicked");}} className={buttonDiv}>
          <Plus />
          <span>New Appointment</span>
        </button>
      )}
    </div>
  );
};

export default TopbarAdmin;
