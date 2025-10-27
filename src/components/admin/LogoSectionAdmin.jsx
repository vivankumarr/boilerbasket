import Image from 'next/image'

const LogoSectionAdmin = () => {
	return (
		<div className='flex gap-4 m-2 p-2 border-0'>
			<Image 
				src='/boilerbasket-logo.png'
				alt='BoilerBasket Logo'
				className='object-scale-down'
				priority={true} // Prevent image from jumping when loading pages
				width={70}
				height={70}
			 />
			<div className='lg:grid hidden'>
				{/* Logo section text is hidden if overflow is possible */}
				<span className='font-bold text-lg'>BoilerBasket</span>
				<span>Staff Dashboard</span>
			</div>
		</div>
	)
};

export default LogoSectionAdmin;