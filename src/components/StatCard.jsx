export default function StatCard({ title, value, description, icon, iconBg = "bg-indigo-100" }) {
  return (
    <div className="bg-white shadow-md rounded-lg w-[270px] h-[125px] p-6 flex flex-col justify-center relative">
        {icon && (
        <div
          className={`absolute bottom-6 right-6 w-[50px] h-[50px] flex items-center justify-center rounded-lg ${iconBg}`}
        >
          {icon}
        </div>
      )}

      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-3xl font-bold text-black-600 mt-2">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
  );
}