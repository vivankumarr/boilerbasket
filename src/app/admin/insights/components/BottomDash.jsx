export default function BottomDash({
    title, firstheading, secondheading, firstdesc, seconddesc, firstval, secondval, firstvaldesc, secondvaldesc
}) {

    return (
        <>
            <div className="bg-white h-75 w-200 rounded-lg shadow-md p-5">
                <h3 className="text-xl font-semibold">{title}</h3>
                <div className="w-full h-full">
                    <div className="flex justify-between items-center mt-5 bg-purple-200 rounded-md h-25 p-2 space-y-1 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
                        <div className="ml-3">
                            <h3 className="text-lg font-semibold">{firstheading}</h3>
                            <span className="text-l">{firstdesc}</span>
                        </div>
                        <div className="mr-5 text-lg font-bold">{firstval}</div>
                    </div>
                    <div className="flex justify-between items-center mt-5 bg-yellow-200 rounded-md h-25 p-2 space-y-1 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
                        <div className="ml-3">
                            <h3 className="text-lg font-semibold">{secondheading}</h3>
                            <span className="text-l">{seconddesc}</span>
                        </div>
                        <div className="mr-5 text-lg font-bold">{secondval}</div>
                    </div>
                </div>
            </div>
        </>
    )
}