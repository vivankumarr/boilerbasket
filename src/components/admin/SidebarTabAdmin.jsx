import Link from "next/link";

const SidebarTabAdmin = ({link, tabDiv, innerDiv, logo, label}) => {
	return (
		<Link href={link} 
			className={tabDiv}>
			<div className={innerDiv}>
				{logo}
				<span>{label}</span>
			</div>
		</Link>
	)
};

export default SidebarTabAdmin;