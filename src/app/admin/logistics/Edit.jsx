import { useState } from "react";
import { editBlockedDate } from "./actions";


const Edit = ({isOpen, changeOpen, currentStart, currentEnd, currentReason, id}) => {

    const [selectedStart, setSelectedStart] = useState(currentStart);
    const [selectedEnd, setSelectedEnd] = useState(currentEnd);
    const [selectedReason, setSelectedReason] = useState(currentReason);
    const [saving, changeSaving] = useState(false);

    const Save = async () => {
        if (!selectedStart || !selectedEnd) return;
        const start = new Date(selectedStart);
        const end = new Date(selectedEnd);
        if (start > end) return;
        changeSaving(true);

        try {
            const result = await editBlockedDate(selectedStart, selectedEnd, selectedReason, id);
            if (!result.success) {
                console.log("An Error occured in Edit Form");
                return;
            }
        }
        catch {
            console.log("Some error occured");
            return;
        }

        setTimeout(() => {
            changeOpen(false);
        }, 1000)
    }


    return (
        <div>
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white shadow-xl w-120 p-6 mt-10 mb-10 rounded-xl flex flex-col relative z-50">
                        <h3 className="text-lg font-semibold mb-3">Edit Closure</h3>
                        <div className="mb-3">
                            <p className="">Start Date</p>
                            <input onChange={(e) => {setSelectedStart(e.target.value)}} value={selectedStart} type="date" className="p-2 rounded border"/>
                        </div>

                        <div className="mb-3">
                            <p className="">End Date</p>
                            <input onChange={(e) => {setSelectedEnd(e.target.value)}} value={selectedEnd} type="date" className="p-2 rounded border"/>
                        </div>

                        <div className="mb-5">
                            <p className="">Reason</p>
                            <input value={selectedReason} onChange={(e) => {setSelectedReason(e.target.value)}}  type="text" className="p-2 rounded border w-full "/>
                        </div>

                        <div className="flex gap-3 w-full justify-between">
                            <button onClick={() => {changeOpen(false)}}className="cursor-pointer bg-slate-200 hover:bg-slate-300 text-slate-800 py-3 px-6 rounded-lg flex-1 font-medium shadow-sm transition">Cancel</button>
                            <button onClick={() => {Save()}}className="cursor-pointer bg-purple-600 hover:bg-purple-700 py-3 px-6 rounded-lg flex-1 text-white font-medium shadow-md hover:shadow-lg">{saving ? "Saving..." : "Save"}</button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    )
}

export default Edit;