const TopbarAdmin = ({ title, subtitle }) => {
	return (
		<div className='grid m-4 ml-6 p-2 border-0'>
			<span className='font-bold text-lg'>{title}</span>
			<span>{subtitle}</span>
		</div>
	)
};

export default TopbarAdmin;