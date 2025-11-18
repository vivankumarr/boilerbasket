"use client";
import { useState } from "react";
import { deleteAppointment } from "@/app/admin/appointments/actions";

const DeleteForm = ({ deletePopup, setDeletePopup, apptId, onRefresh }) => {
  // shows error message for booking form
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const result = await deleteAppointment(apptId);

      // Error
      if (!result.success) {
        setMessage(result.error || "An error occurred. Please try again.");
        setLoading(false);
        return;
      }

      // Success
      setSuccess(true);
      setMessage("Appointment deleted successfully.");
      setDeletePopup(false);
      if (onRefresh) {
        await onRefresh();
      }
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
              Are you sure you want to delete this appointment?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeletePopup(false)}
                className="px-4 py-2 border rounded"
              >
                {loading ? "Deleting..." : "Cancel"}
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
