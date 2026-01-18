import TopbarAdmin from "@/components/admin/TopbarAdmin";
import SidebarAdmin from "@/components/admin/SidebarAdmin";
import Image from "next/image";
import { PopupProvider } from "@/components/admin/ScheduleAppointmentPopupContext";

const parentDiv =
  "relative bg-black \
					h-screen w-full";

// Manually (for now) remove excess space
const contentDiv = "absolute top-25 left-60 right-0 bottom-0 bg-stone-100";

const logoDiv =
  "bg-yellow-100 \
				justify-center \
				z-3 shadow-sm/20 \
				flex items-center \
				fixed top-0 left-0 h-25 w-60";
const topDiv =
  "bg-white \
				z-11 shadow-md/10 \
				flex items-center \
				fixed top-0 left-60 h-25 w-[calc(100%-15rem)]\
				justify-between";
const sideDiv =
  "bg-amber-50 \
				z-2 shadow-md/20 \
				fixed top-25 left-0 w-60 h-full";

export default function layout({ children }) {
  return (
    <PopupProvider>
      <div className={parentDiv}>
        <div className={logoDiv}>
          <div className="flex gap-4 m-2 p-2 border-0">
            <Image
              src="/boilerbasket-logo.png"
              alt="BoilerBasket Logo"
              className="object-scale-down"
              priority={true} // Prevent image from jumping when loading pages
              width={70}
              height={70}
            />
		<div className="sm:grid hidden">
              {/* Logo section text is hidden if overflow is possible */}
              <span className="font-bold text-lg">BoilerBasket</span>
              <span className="text-sm">Staff Dashboard</span>
            </div>
          </div>
        </div>
        <nav className={topDiv}>
          {/* Title and subtitle text changes based on current page */}
          <TopbarAdmin />
        </nav>
        <aside className={sideDiv}>
          <SidebarAdmin />
        </aside>
        <div className={contentDiv}>{children}</div>
      </div>
    </PopupProvider>
  );
}