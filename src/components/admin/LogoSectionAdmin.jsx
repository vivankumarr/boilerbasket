import Image from 'next/image'

// TODO: Make clickable? No dashboard home, so link to first tab ("Appointments")

const LogoSectionAdmin = () => {
	return (
		<div className='flex gap-4 m-2 p-2 border-0'>
			<Image 
				src='/boilerbasket-logo.png' // TODO: Sharpen image?
				alt='BoilerBasket Logo'
				className='object-scale-down'
				priority={true} // Prevent image from jumping when loading pages
				width={70}
				height={70}
			 />
			<div className='sm:grid hidden'>
				{/* Logo section text is hidden if overflow is possible */}
				<span className='font-bold text-lg'>BoilerBasket</span>
				<span>Staff Dashboard</span>
			</div>
		</div>
	)
};

export default LogoSectionAdmin;