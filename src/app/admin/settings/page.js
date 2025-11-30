export default function Page() {
  return (
    <div className="flex h-screen">
      {/* MAIN content: settings stuff goes here */}
      <div className="flex-1 h-screen">
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
           
                      {/* Making sure thhis button adds closure and reaspn
                        to the currently blocked dates  */}
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