import { useState } from "react";
import { updateComplaintStatusApi } from "../../api/official.api";
import StatusStamp from "../../components/StatusStamp.jsx";

function ComplaintDetailModal({ complaint, onClose, onStatusUpdated }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  // Helper to format backend file paths correctly for URLs
  const getImageUrl = (rawPath) => {
    if (!rawPath) return "";
    let cleanPath = rawPath.replace(/\\/g, "/");
    if (cleanPath.startsWith("/")) {
      cleanPath = cleanPath.slice(1);
    }
    return `http://localhost:3000/${cleanPath}`;
  };

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
    <div
      className="fixed inset-0 overflow-y-auto p-4 ns-scrollbar font-body"
      style={{ background: "rgba(20, 26, 23, 0.6)", zIndex: 1000 }}
    >
      <div className="ns-card max-w-3xl mx-auto my-6 p-5 sm:p-7">
        <div className="flex justify-between items-start mb-4 gap-3">
          <h2 className="font-display font-bold text-xl" style={{ color: "var(--ink)" }}>
            Complaint details
          </h2>
          <button onClick={onClose} className="ns-btn ns-btn-ghost text-xs px-3 py-1.5">
            Close &times;
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm mb-4">
          <p><span className="font-semibold" style={{ color: "var(--ink-soft)" }}>Department</span> — {complaint.departmentName}</p>
          <p><span className="font-semibold" style={{ color: "var(--ink-soft)" }}>Problem type</span> — {complaint.problemType}</p>
          <p><span className="font-semibold" style={{ color: "var(--ink-soft)" }}>Severity</span> — {complaint.severity}</p>
          <p><span className="font-semibold" style={{ color: "var(--ink-soft)" }}>Priority</span> — {complaint.priority}</p>
          <p className="flex items-center gap-2">
            <span className="font-semibold" style={{ color: "var(--ink-soft)" }}>Status</span> <StatusStamp status={complaint.status} />
          </p>
          <p><span className="font-semibold" style={{ color: "var(--ink-soft)" }}>Merged reports</span> — {complaint.mergeCount}</p>
        </div>
        <p className="text-sm italic mb-5" style={{ color: "var(--ink-soft)" }}>"{complaint.aiSummary}"</p>

        <hr className="ns-divider mb-5" />

        <h3 className="font-display font-bold text-base mb-3" style={{ color: "var(--ink)" }}>
          Subscribed reports ({complaint.descriptions?.length || 0})
        </h3>

        <div className="flex flex-col gap-3 mb-5">
          {complaint.descriptions?.map((desc, idx) => {
            const location = complaint.locations?.[idx];
            const user = complaint.userIds?.[idx];
            const contact = complaint.contactNumbers?.[idx];
            const evidence = complaint.evidenceIds?.[idx];
            const imageSrc = evidence ? getImageUrl(evidence.imagePath) : null;

            return (
              <div key={idx} className="p-3.5 rounded-xl" style={{ border: "1px solid var(--border)", background: "var(--paper-dim)" }}>
                <p className="text-xs font-mono font-semibold mb-2" style={{ color: "var(--ink-faint)" }}>
                  REPORT #{idx + 1}
                </p>
                <p className="text-sm mb-2" style={{ color: "var(--ink)" }}>{desc}</p>

                {location && (
                  <div className="text-xs font-mono mb-2" style={{ color: "var(--ink-soft)" }}>
                    <p>{location.textLocation}</p>
                    <p>Lat {location.latitude}, Lng {location.longitude}</p>
                  </div>
                )}

                {user && (
                  <div className="text-xs mb-2" style={{ color: "var(--ink-soft)" }}>
                    <p>User — {user.username || "Anonymous / Unlisted"}</p>
                    {contact && <p>Contact — {contact}</p>}
                  </div>
                )}

                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt="Complaint evidence"
                    className="mt-1 rounded-lg cursor-pointer"
                    style={{ width: "160px", height: "120px", objectFit: "cover", border: "1px solid var(--border)" }}
                    onClick={() => setSelectedImage(imageSrc)}
                    onError={() => console.error("Failed to load image at:", imageSrc)}
                  />
                ) : (
                  <p className="text-xs italic" style={{ color: "var(--ink-faint)" }}>No evidence photo attached.</p>
                )}
              </div>
            );
          })}
        </div>

        <hr className="ns-divider mb-5" />

        <div>
          <h3 className="font-display font-bold text-base mb-3" style={{ color: "var(--ink)" }}>
            Update status
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {complaint.status === "UNDER_REVIEW" && (
              <>
                <button onClick={() => handleStatusChange("WORK_IN_PROGRESS")} className="ns-btn ns-btn-primary">
                  Move to work in progress
                </button>
                <button onClick={() => setShowRejectInput(true)} className="ns-btn ns-btn-danger">
                  Reject complaint
                </button>
              </>
            )}

            {complaint.status === "WORK_IN_PROGRESS" && (
              <>
                <button onClick={() => handleStatusChange("RESOLVED")} className="ns-btn ns-btn-accent">
                  Mark as resolved
                </button>
                <button onClick={() => setShowRejectInput(true)} className="ns-btn ns-btn-danger">
                  Reject complaint
                </button>
              </>
            )}
          </div>

          {showRejectInput && (
            <div className="mt-3.5 flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                placeholder="Enter rejection reason…"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="ns-input flex-1"
              />
              <div className="flex gap-2.5">
                <button onClick={() => handleStatusChange("REJECTED")} className="ns-btn ns-btn-danger">
                  Confirm rejection
                </button>
                <button onClick={() => setShowRejectInput(false)} className="ns-btn ns-btn-ghost">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{ background: "rgba(10, 15, 13, 0.9)", zIndex: 1100 }}
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Expanded evidence"
            className="rounded-xl"
            style={{ maxWidth: "90%", maxHeight: "90%" }}
          />
        </div>
      )}
    </div>
  );
}

export default ComplaintDetailModal;
