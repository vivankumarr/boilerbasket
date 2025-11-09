import TopbarAdmin from '@/components/admin/TopbarAdmin'
import SidebarAdmin from '@/components/admin/SidebarAdmin'
import Image from 'next/image'

// TODO: Responsive design based on device screen size (but probably won't be accessed on mobile)
// Uniform styling (set custom fonts, not default)
// Adjust line spacing for text (logo, top)
// Get better tab logos?
// Change title in browser tab based on page

// Color Reference: https://find-nearest-tailwind-colour.netlify.app/
// https://tailwindcss.com/docs/colors

const parentDiv = 'bg-black \
					h-screen w-full'

// Manually (for now) remove excess space
const contentDiv = 'bg-stone-100 p-4 \
					relative top-25 left-60 \
					w-[calc(100%-15rem)] h-[calc(100%-6.3rem)]'

const logoDiv = 'bg-yellow-100 \
				justify-center \
				z-3 shadow-sm/20 \
				flex items-center \
				fixed top-0 left-0 h-25 w-60'
const topDiv = 'bg-white \
				z-1 shadow-md/10 \
				flex items-center \
				fixed top-0 left-60 h-25 w-[calc(100%-60px)]'
const sideDiv = 'bg-amber-50 \
				z-2 shadow-md/20 \
				fixed top-25 left-0 w-60 h-full'

// TODO: Account for "Add Client" button in Clients page (top navigation bar)

export default function layout({ children }) {
	return (
		<div className={parentDiv}>
			<div className={logoDiv}>
				<div className='flex gap-4 m-2 p-2 border-0'>
							<Image 
								src='/boilerbasket-logo.png'
								alt='BoilerBasket Logo'
								className='object-scale-down'
								priority={true} // Prevent image from jumping when loading pages
								width={70}
								height={70}
							 />
							<div className='sm:grid hidden'>
								{/* Logo section text is hidden if overflow is possible */}
								<span className='font-bold text-lg'>BoilerBasket</span>
								<span className='text-sm'>Staff Dashboard</span>
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
			<div className={contentDiv}>
				{children}
			</div>
		</div>	
	)
};