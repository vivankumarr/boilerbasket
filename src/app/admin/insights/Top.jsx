export default function Top({ Title, Value, Icon, Description }) {
    return (
      <div className="bg-white h-full w-full sm:w-1/2 lg:w-1/4 shadow-md rounded-lg p-6 flex flex-col transition-shadow hover:shadow-xl overflow-hidden">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide truncate">
            {Title}
          </h3>
          {Icon && (
            <div className="flex-shrink-0 ml-2 text-gray-400">
              {Icon}
            </div>
          )}
        </div>

        <div className="flex-1 flex items-center">
          <p className="text-4xl font-bold text-gray-900 break-words">
            {Value}
          </p>
        </div>
        
        <div className="">
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
            {Description}
          </p>
        </div>
      </div>
    );
  }