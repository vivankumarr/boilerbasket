export default function StatCard({ title, value,
	description, descStyle = 'text-gray-500',
	icon, iconBg = "bg-indigo-100" }) {
  return (
    <div className="cursor-pointer bg-white shadow-md rounded-lg w-[270px] h-[125px] p-6 flex flex-col justify-center relative transition-all duration-200 hover:translate-y-1 hover:shadow-xl">

      <div className="flex justify-between flex-row items-center">
        <h3 className="text-l font-semibold text-gray-800">{title}</h3>
        <div className={`${iconBg} rounded-md p-2`}>{icon}</div>
      </div>

      <p className="text-3xl font-bold text-black-600">{value}</p>
      <p className={`text-sm ${descStyle}`}>{description}</p>
    </div>
  );
}