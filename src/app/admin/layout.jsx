import LogoSectionAdmin from '@/components/admin/LogoSectionAdmin'
import ConditionalTopbarAdmin from '@/components/admin/ConditionalTopbarAdmin'
import SidebarAdmin from '@/components/admin/SidebarAdmin'

// TODO: Fixed (not relative) navigation bar sizing
// Responsive design based on device screen size (but probably won't be accessed on mobile)
// Uniform styling (set custom fonts, not default)
// Adjust line spacing for text (logo, top)

// Color Reference: https://find-nearest-tailwind-colour.netlify.app/
// https://tailwindcss.com/docs/colors

const parentDiv = 'bg-purple-50 \
					min-h-screen \
					grid \
					grid-cols-[1fr_5fr] \
					grid-rows-[1fr_7fr]'
const logoDiv = 'bg-yellow-100 \
				justify-center \
				flex items-center \
				z-3 shadow-sm/20 ' // + 'border-2 border-yellow-200'
const topDiv = 'bg-white \
				flex items-center \
				z-1 shadow-md/10 ' // + 'border-2 border-gray-200'
const sideDiv = 'bg-orange-50 \
				z-2 shadow-md/20 ' // + 'border-2 border-orange-100'
const contentDiv = 'bg-stone-100 p-4 ' // + 'border-2 border-stone-300'

// TODO: Account for "Add Client" button in Clients page (top navigation bar)

function layout({ children }) {
	return (
		<div className={parentDiv}>
			<div className={logoDiv}>
				<LogoSectionAdmin />
			</div>
			<nav className={topDiv}>
				{/* Title and subtitle text changes based on current page */}
				<ConditionalTopbarAdmin />
			</nav>
			<nav className={sideDiv}>
				<SidebarAdmin />
			</nav>
			<div className={contentDiv}>
				{children}
			</div>
		</div>	
	)
};

export default layout;