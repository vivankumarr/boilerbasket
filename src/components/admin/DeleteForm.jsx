"use client";

import { useState, useEffect } from "react";
import { deleteAppointment } from "@/app/admin/appointments/actions";
import { deleteClient } from "@/app/admin/clients/actions";

const DeleteForm = ({ deletePopup, setDeletePopup, apptId, onSuccess, context }) => {
  // shows error message for booking form
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);

  // Wipe memory each time the popup is opened
  useEffect(() => {
    if (deletePopup) {
      setSuccess(false);
      setMessage(null);
      setLoading(false);
    }
  }, [deletePopup]);

  const rowType = (context == "clients") ? ("client") : ("appointment");

  const handleDelete = async () => {
    setLoading(true);
    try {
      var result;
	  var successMessage;

	  switch (context) {
		case "clients":
			result = await deleteClient(apptId); // clientId
			successMessage = "Client deleted successfully";
			break;
		default: // appointments
      		result = await deleteAppointment(apptId);
			successMessage = "Appointment deleted successfully.";
	  }

      // Error
      if (!result.success) {
        setMessage(result.error || "An error occurred. Please try again.");
        setLoading(false);
        return;
      }

      // Success
      setSuccess(true);
      setMessage(successMessage);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {deletePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-3">Confirm Deletion</h3>
            <p className="mb-4">
              Are you sure you want to delete this {rowType}?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeletePopup(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete()}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>

            {!success && message && (
              <p className="mt-3 text-red-600">{message}</p>
            )}
            {success && (
              <p className="mt-3 text-green-700">{message}</p>
            )}
            
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteForm;
