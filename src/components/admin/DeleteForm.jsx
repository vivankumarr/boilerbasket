"use client";

import { useState, useEffect } from "react";
import { deleteAppointment } from "@/app/admin/appointments/actions";
import { deleteClient } from "@/app/admin/clients/actions";
import { deleteBlockedDate } from "@/app/admin/logistics/actions";

const DeleteForm = ({ deletePopup, setDeletePopup, apptId, onSuccess, context }) => {
  // shows error message for booking form
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);
  const [displayMessage, setDisplayMessage] = useState(false);

  // Wipe memory each time the popup is opened
  useEffect(() => {
    if (deletePopup) {
      setSuccess(false);
      setMessage(null);
      setLoading(false);
      setDisplayMessage(false);
    }
  }, [deletePopup]);

  const rowLookUp = {
    'clients' : 'client',
    'appointment': 'appointment',
    'blockedDates' : 'closure',
  }
  const rowType = rowLookUp[context];

  const handleDelete = async () => {
    setLoading(true);
    try {
      var result;
	    var successMessage;

	    switch (context) {
		    case "clients":
			    result = await deleteClient(apptId); // clientId
			    successMessage = "Client deleted successfully.";
			    break;
        case "blockedDates":
          result = await deleteBlockedDate(apptId);
          successMessage = "Closure deleted successfully.";
          break;
		    default: // appointments
      	  result = await deleteAppointment(apptId);
			    successMessage = "Appointment deleted successfully.";
	    }


      // Error
      if (!result.success) {
        setMessage(result.error || "An error occurred. Please try again.");
        setDisplayMessage(true);
        console.log("Error");
        setLoading(false);
        return;
      }

      // Success
      setSuccess(true);
      setMessage(successMessage);
      setDisplayMessage(true);

      // Give the user a moment to read the success message before close + refresh
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        }
        setSuccess(false);
        setMessage(null);
      }, 1500);

    } catch (err) {
      setMessage("Unexpected error: " + (err.message || err));
      setDisplayMessage(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {deletePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl shadow-lg">
            
            {!displayMessage ? (<div>
              <h3 className="text-lg font-semibold mb-3">Confirm Deletion</h3>
              <p className="mb-4">
                Are you sure you want to delete this {rowType}?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeletePopup(false)}
                  className="px-4 py-2 border rounded cursor-pointer hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete()}
                  className="cursor-pointer px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>) : (
              <div className="flex flex-col items-center">
                {!success && message && (
                  <span className="text-lg text-red-600">{message}</span>
                  )}
                  {success && (
                    <span className="text-lg text-emerald-500">{message}</span>
                  )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteForm;
