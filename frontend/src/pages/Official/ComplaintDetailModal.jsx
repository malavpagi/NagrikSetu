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
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        overflowY: "auto",
        padding: "20px",
        zIndex: 1000,
      }}
    >
      <div style={{ background: "#fff", padding: "20px", maxWidth: "800px", margin: "auto" }}>
        <button onClick={onClose} style={{ float: "right" }}>Close [X]</button>
        <h2>Complaint Details</h2>

        {/* Aggregate Metadata */}
        <div>
          <p><strong>Department:</strong> {complaint.departmentName}</p>
          <p><strong>Problem Type:</strong> {complaint.problemType}</p>
          <p><strong>Severity:</strong> {complaint.severity}</p>
          <p><strong>Priority:</strong> {complaint.priority}</p>
          <p><strong>Current Status:</strong> {complaint.status}</p>
          <p><strong>Merged Reports Count:</strong> {complaint.mergeCount}</p>
          <p><strong>AI Summary:</strong> {complaint.aiSummary}</p>
        </div>

        <hr />

        <h3>Subscribed Reports ({complaint.descriptions?.length || 0})</h3>

        {/* List of individual merged complaints */}
        {complaint.descriptions?.map((desc, idx) => {
          const location = complaint.locations?.[idx];
          const user = complaint.userIds?.[idx];
          const contact = complaint.contactNumbers?.[idx];
          const evidence = complaint.evidenceIds?.[idx];

          return (
            <div key={idx} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
              <h4>Report #{idx + 1}</h4>
              <p><strong>Description:</strong> {desc}</p>
              
              {location && (
                <div>
                  <p><strong>Text Location:</strong> {location.textLocation}</p>
                  <p><strong>Coordinates:</strong> Lat {location.latitude}, Lng {location.longitude}</p>
                </div>
              )}

              {/* User Privacy Rules */}
              {user && (
                <div>
                  <p><strong>User:</strong> {user.username || "Anonymous / Unlisted"}</p>
                  {contact && <p><strong>Contact:</strong> {contact}</p>}
                </div>
              )}

              {/* Evidence Rendering */}
              {evidence && (
                <div>
                  <p><strong>Evidence File:</strong></p>
                  <img
                    src={`http://localhost:3000/${evidence.filePath}`}
                    alt="Evidence"
                    style={{ width: "150px", height: "150px", objectFit: "cover", cursor: "pointer" }}
                    onClick={() => setSelectedImage(`http://localhost:3000/${evidence.filePath}`)}
                  />
                </div>
              )}
            </div>
          );
        })}

        <hr />

        {/* Status Actions */}
        <div>
          <h3>Update Status</h3>
          {complaint.status === "UNDER_REVIEW" && (
            <>
              <button onClick={() => handleStatusChange("WORK_IN_PROGRESS")}>
                Move to Work in Progress
              </button>{" "}
              <button onClick={() => setShowRejectInput(true)}>Reject Complaint</button>
            </>
          )}

          {complaint.status === "WORK_IN_PROGRESS" && (
            <>
              <button onClick={() => handleStatusChange("RESOLVED")}>Mark as Resolved</button>{" "}
              <button onClick={() => setShowRejectInput(true)}>Reject Complaint</button>
            </>
          )}

          {showRejectInput && (
            <div style={{ marginTop: "10px" }}>
              <input
                type="text"
                placeholder="Enter rejection reason..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                style={{ width: "80%", padding: "5px" }}
              />
              <br /><br />
              <button onClick={() => handleStatusChange("REJECTED")}>Confirm Rejection</button> {" "}
              <button onClick={() => setShowRejectInput(false)}>Cancel</button>
            </div>
          )}
        </div>
      </div>

      {/* Expanded Image Viewer Modal */}
      {selectedImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.85)",
            zIndex: 1100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setSelectedImage(null)}
        >
          <img src={selectedImage} alt="Expanded Evidence" style={{ maxWidth: "90%", maxHeight: "90%" }} />
        </div>
      )}
    </div>
  );
}

export default ComplaintDetailModal;