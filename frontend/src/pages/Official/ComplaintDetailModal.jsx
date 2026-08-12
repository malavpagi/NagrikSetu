import { useState } from "react";
import { updateComplaintStatusApi } from "../../api/official.api";
import StatusStamp from "../../components/StatusStamp.jsx";
import { IconClose } from "../../components/icons.jsx";

function ComplaintDetailModal({ complaint, onClose, onStatusUpdated }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  // Helper to format backend file paths correctly for URLs
  const getImageUrl = (rawPath) => {
    if (!rawPath) return "";
    // 1. Normalize Windows backslashes (\) to standard forward slashes (/)
    let cleanPath = rawPath.replace(/\\/g, "/");

    // 2. Remove leading slash if present
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
    <div className="ns-modal-overlay">
      <div className="ns-modal">
        <div className="ns-modal-head">
          <div>
            <p className="ns-page-eyebrow">Complaint record</p>
            <h2 style={{ marginBottom: 6 }}>{complaint.problemType}</h2>
            <StatusStamp status={complaint.status} />
          </div>
          <button className="ns-modal-close" onClick={onClose} aria-label="Close">
            <IconClose width={15} height={15} />
          </button>
        </div>

        <div className="ns-record-meta" style={{ gridTemplateColumns: "1fr 1fr", marginTop: 16 }}>
          <p><b>Department:</b> {complaint.departmentName}</p>
          <p><b>Severity:</b> {complaint.severity}</p>
          <p><b>Priority:</b> {complaint.priority}</p>
          <p><b>Merged reports:</b> {complaint.mergeCount}</p>
        </div>
        <p className="ns-quote" style={{ marginTop: 14 }}>{complaint.aiSummary}</p>

        <hr className="ns-tear" />

        <h3 style={{ fontSize: "1rem", marginBottom: 12 }}>
          Subscribed reports ({complaint.descriptions?.length || 0})
        </h3>

        {complaint.descriptions?.map((desc, idx) => {
          const location = complaint.locations?.[idx];
          const user = complaint.userIds?.[idx];
          const contact = complaint.contactNumbers?.[idx];
          const evidence = complaint.evidenceIds?.[idx];

          // Use imagePath from EvidenceCollection
          const imageSrc = evidence ? getImageUrl(evidence.imagePath) : null;

          return (
            <div key={idx} className="ns-report-card">
              <h4>Report #{idx + 1}</h4>
              <p style={{ fontSize: "0.9rem" }}>{desc}</p>

              {location && (
                <div className="ns-record-meta" style={{ borderTop: "none", marginTop: 4, paddingTop: 0 }}>
                  <p><b>Location:</b> {location.textLocation}</p>
                  <p><b>Coordinates:</b> {location.latitude}, {location.longitude}</p>
                </div>
              )}

              {user && (
                <div className="ns-record-meta" style={{ borderTop: "none", marginTop: 4, paddingTop: 0 }}>
                  <p><b>Reported by:</b> {user.username || "Anonymous / unlisted"}</p>
                  {contact && <p><b>Contact:</b> {contact}</p>}
                </div>
              )}

              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt="Complaint evidence"
                  className="ns-evidence-thumb"
                  onClick={() => setSelectedImage(imageSrc)}
                  onError={(e) => {
                    console.error("Failed to load image at:", imageSrc);
                  }}
                />
              ) : (
                <p className="ns-muted" style={{ fontSize: "0.85rem", marginTop: 8 }}><em>No evidence photo attached.</em></p>
              )}
            </div>
          );
        })}

        <hr className="ns-tear" />

        <div>
          <h3 style={{ fontSize: "1rem", marginBottom: 12 }}>Update status</h3>
          <div className="ns-flex-actions">
            {complaint.status === "UNDER_REVIEW" && (
              <>
                <button className="btn btn-primary" onClick={() => handleStatusChange("WORK_IN_PROGRESS")}>
                  Move to work in progress
                </button>
                <button className="btn btn-danger" onClick={() => setShowRejectInput(true)}>Reject complaint</button>
              </>
            )}

            {complaint.status === "WORK_IN_PROGRESS" && (
              <>
                <button className="btn btn-primary" onClick={() => handleStatusChange("RESOLVED")}>Mark as resolved</button>
                <button className="btn btn-danger" onClick={() => setShowRejectInput(true)}>Reject complaint</button>
              </>
            )}
          </div>

          {showRejectInput && (
            <div className="ns-reject-box">
              <input
                type="text"
                className="ns-input"
                placeholder="Enter rejection reason…"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
              <div className="ns-flex-actions">
                <button className="btn btn-danger" onClick={() => handleStatusChange("REJECTED")}>Confirm rejection</button>
                <button className="btn btn-ghost" onClick={() => setShowRejectInput(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Image Preview */}
      {selectedImage && (
        <div className="ns-lightbox" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Expanded evidence" />
        </div>
      )}
    </div>
  );
}

export default ComplaintDetailModal;
