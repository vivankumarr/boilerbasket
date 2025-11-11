export default function Page() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-[#FFF9EE] p-4">
        {/*top boilerbasket title*/}
        <div className="bg-[#FFFEDC] p-4 -m-4 shadow-md">
            <h1 className="font-bold text-xl">BoilerBasket</h1>
            <h2 className="text-sm">Staff Dashboard</h2>
        </div>

        {/* Menu items */}
        <ul className='mt-8'>
          <li className="py-2 px-2 rounded hover:bg-[#FFFEDC] cursor-pointer">Appointments</li>
          <li className="py-2 px-2 rounded hover:bg-[#FFFEDC] cursor-pointer">Insights</li>
          <li className="py-2 px-2 rounded hover:bg-[#FFFEDC] cursor-pointer">Clients</li>
          <li className="py-2 px-2 rounded hover:bg-[#FFFEDC] cursor-pointer ">Export Data</li>
          <li className="py-2 px-2 rounded border border-[#DBAC00] bg-[#FFFEDC] cursor-pointer">Settings</li>
        </ul>
      </div>

      {/* MAIN content: settings stuff goes here */}
      <div className="flex-1 h-screen">
        {/* Top box for settings title */}
        <div className="bg-[#FFFFFF] p-4 rounded mb-6 shadow-lg">
          <h1 className="font-bold text-lg">Settings</h1>
          <p className="text-sm">Manage closures and preferences</p>
        </div>
        {/* Large Box */}
          {/* Calendar input */}
        <div className="bg-white rounded p-6 m-6 h-3/4 shadow-lg">
          <h2 className="font-bold text-lg mb-2">Add a Closure</h2>

          <input type='date' className="w-100 p-2 mb-4 border border-gray-300 rounded bg-white text-white-700"/>
            {/* reason input */}
          <p className="font-bold text-lg mb-2">Reason</p>
          <input type="text" placeholder="Enter reason here..." 
          className="w-100 p-2 mb-4 border border-gray-300 rounded bg-white text-gray-700 block"/>
            {/* Add closure button*/}
          <button className="bg-[#741FA8] w-50 text-white px-4 py-2 rounded flex items-center justify-center gap-2 hover:bg-purple-800">
            <span className="text-sm font-normal">+</span>
            <span className="text-sm font-semibold">Add Closure</span>
          </button>

        </div>
        {/* Small Box */}
        <div className="bg-white rounded p-4 m-6 h-32 shadow">
          <h2 className="font-bold text-lg mb-2">Currently Blocked Dates</h2>

          {/* grey header row */}
          <div className = 'bg-gray-100 p-2 rounded flex justify-between font-semibold text-sm'>
            <span>Dates(s)</span>
            <span>Reasons</span>
            <span>Action</span>
          </div>
        </div>

      </div>
    </div>
  );
}