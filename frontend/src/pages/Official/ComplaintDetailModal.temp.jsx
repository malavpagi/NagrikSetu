import { useState } from "react";
import { updateComplaintStatusApi } from "../../api/official.api";

function ComplaintDetailModal({ complaint, onClose, onStatusUpdated }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  const handleStatusChange = async (newStatus) => {
    if (newStatus === "REJECTED" && !rejectionReason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }

    try {
      await updateComplaintStatusApi(complaint._id, {
        status: newStatus,
        rejectionReason: newStatus === "REJECTED" ? rejectionReason : null,
      });
      alert(`Complaint status updated to ${newStatus}`);
      onStatusUpdated();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl rounded-[32px] bg-white p-6 shadow-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Complaint Details</h2>
            <p className="text-sm text-slate-600">View the full report and update the workflow status.</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            Close
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[24px] bg-slate-50 p-4 shadow-sm">
            <p className="text-sm text-slate-500">Department</p>
            <p className="mt-2 font-semibold text-slate-900">{complaint.departmentName || "Unassigned"}</p>
          </div>
          <div className="rounded-[24px] bg-slate-50 p-4 shadow-sm">
            <p className="text-sm text-slate-500">Current Status</p>
            <p className="mt-2 font-semibold text-slate-900">{complaint.status}</p>
          </div>
          <div className="rounded-[24px] bg-slate-50 p-4 shadow-sm">
            <p className="text-sm text-slate-500">Priority</p>
            <p className="mt-2 font-semibold text-slate-900">{complaint.priority || "N/A"}</p>
          </div>
          <div className="rounded-[24px] bg-slate-50 p-4 shadow-sm">
            <p className="text-sm text-slate-500">Merged Reports</p>
            <p className="mt-2 font-semibold text-slate-900">{complaint.mergeCount ?? 0}</p>
          </div>
        </div>

        <div className="mt-6 rounded-[28px] border border-slate-200 bg-slate-50 p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">AI Summary</h3>
          <p className="mt-3 text-sm leading-6 text-slate-700">{complaint.aiSummary || "No summary available."}</p>
        </div>

        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Subscribed Reports ({complaint.descriptions?.length || 0})</h3>
          {(complaint.descriptions || []).map((desc, idx) => {
            const location = complaint.locations?.[idx];
            const user = complaint.userIds?.[idx];
            const contact = complaint.contactNumbers?.[idx];
            const evidence = complaint.evidenceIds?.[idx];

            return (
              <div key={idx} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Report #{idx + 1}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      <span className="font-semibold text-slate-900">Description:</span> {desc}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[24px] bg-slate-50 p-4 shadow-sm">
                    <p className="text-sm font-semibold text-slate-900">Location</p>
                    <p className="mt-2 text-sm text-slate-700">{location?.textLocation || "Unknown"}</p>
                    {location && <p className="mt-1 text-xs text-slate-500">Lat {location.latitude}, Lng {location.longitude}</p>}
                  </div>
                  <div className="rounded-[24px] bg-slate-50 p-4 shadow-sm">
                    <p className="text-sm font-semibold text-slate-900">Reporter</p>
                    <p className="mt-2 text-sm text-slate-700">{user?.username || "Anonymous / Unlisted"}</p>
                    {contact && <p className="mt-1 text-xs text-slate-500">{contact}</p>}
                  </div>
                </div>

                {evidence && (
                  <button
                    type="button"
                    onClick={() => setSelectedImage(`http://localhost:3000/${evidence.filePath}`)}
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                  >
                    View Evidence
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 rounded-[28px] border border-slate-200 bg-slate-50 p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Update Status</h3>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {complaint.status === "UNDER_REVIEW" && (
              <>
                <button
                  onClick={() => handleStatusChange("WORK_IN_PROGRESS")}
                  className="rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
                >
                  Move to Work in Progress
                </button>
                <button
                  onClick={() => setShowRejectInput(true)}
                  className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  Reject Complaint
                </button>
              </>
            )}
            {complaint.status === "WORK_IN_PROGRESS" && (
              <>
                <button
                  onClick={() => handleStatusChange("RESOLVED")}
                  className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Mark as Resolved
                </button>
                <button
                  onClick={() => setShowRejectInput(true)}
                  className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  Reject Complaint
                </button>
              </>
            )}
          </div>

          {showRejectInput && (
            <div className="mt-5 rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
              <label className="block text-sm font-semibold text-slate-700">Rejection Reason</label>
              <input
                type="text"
                placeholder="Enter rejection reason..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="mt-3 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
              />
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => handleStatusChange("REJECTED")}
                  className="rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
                >
                  Confirm Rejection
                </button>
                <button
                  onClick={() => setShowRejectInput(false)}
                  className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4" onClick={() => setSelectedImage(null)}>
          <img
            src={selectedImage}
            alt="Expanded Evidence"
            className="max-h-[90vh] max-w-[90vw] rounded-[28px] object-contain"
          />
        </div>
      )}
    </div>
  );
}

export default ComplaintDetailModal;
