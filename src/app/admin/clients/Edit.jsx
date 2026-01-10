import { useState } from "react";
import { editClient } from "./actions";

const Edit = ({isOpen, changeOpen, data}) => {
    const [fullName, setFullName] = useState(data.full_name);
    const [role, setRole] = useState(data.role);
    const [PUID, setPUID] = useState(data.puid);
    const [email, setEmail] = useState(data.email);

    const [saving, changeSaving] = useState(false);

    const Save = async () => {
        console.log(role);
        changeSaving(true)
        try {
            const result = await editClient(data.id, {full_name_new: fullName, email_new: email, puid_new: PUID, role_new: role});
            if (!result.success) {
                console.log("uh oh...");
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
                        <h3 className="text-lg font-semibold mb-3">Edit Client</h3>
                        <div className="mb-3 flex flex-row justify-between items-center">
                            <p className="">Full Name</p>
                            <input className="border p-2 rounded" value={fullName} type="text" onChange={(e) => {setFullName(e.target.value)}}/>
                        </div>

                        <div className="mb-3 flex flex-row justify-between items-center">
                            <p className="">Role</p>
                            <select value={role} onChange={(e) => {setRole(e.target.value)}} className="border p-2 rounded">
                                <option value="Student">Student</option>
                                <option value="Faculty">Faculty</option>
                                <option value="Staff">Staff</option>
                            </select>
                        </div>

                        <div className="mb-3 flex flex-row justify-between items-center">
                            <p className="">Email</p>
                            <input value={email} onChange={(e) => (setEmail(e.target.value))} type="text" className="border p-2 rounded"/>
                        </div>

                        <div className="mb-5 flex flex-row justify-between items-center">
                            <p className="">PUID</p>
                            <input value={PUID} onChange={(e) => (setPUID(e.target.value))} type="text" className="border p-2 rounded"/>
                        </div>

                        <div className="flex gap-3 w-full justify-between">
                            <button onClick={() => {changeOpen(false)}} className="cursor-pointer bg-slate-200 hover:bg-slate-300 text-slate-800 py-3 px-6 rounded-lg flex-1 font-medium shadow-sm transition">Cancel</button>
                            <button onClick={() => {Save()}} className="cursor-pointer bg-purple-600 hover:bg-purple-700 py-3 px-6 rounded-lg flex-1 text-white font-medium shadow-md hover:shadow-lg">{saving ? "Saving..." : "Save"}</button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    )
}

export default Edit;