import { useState, useEffect } from "react";
import { getOfficialComplaintsApi, updateComplaintStatusApi } from "../../api/official.api";
import ComplaintDetailModal from "./ComplaintDetailModal";

function IncomingComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const fetchIncoming = async () => {
    try {
      setLoading(true);
      const res = await getOfficialComplaintsApi("incoming");
      setComplaints(res.data || res);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch incoming complaints.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncoming();
  }, []);

  const handleCardClick = async (complaint) => {
    // Automatically transition SUBMITTED to UNDER_REVIEW
    if (complaint.status === "SUBMITTED") {
      try {
        await updateComplaintStatusApi(complaint._id, { status: "UNDER_REVIEW" });
        complaint.status = "UNDER_REVIEW";
      } catch (err) {
        console.error("Failed to auto-update status to UNDER_REVIEW:", err);
      }
    }
    setSelectedComplaint(complaint);
  };

  if (loading) return <div>Loading incoming complaints...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section>
      <h2>Incoming Complaints List</h2>
      {complaints.length === 0 ? (
        <p>No incoming complaints available.</p>
      ) : (
        <div>
          {complaints.map((item) => (
            <article
              key={item._id}
              onClick={() => handleCardClick(item)}
              style={{ border: "1px solid #333", padding: "10px", marginBottom: "10px", cursor: "pointer" }}
            >
              <h3>Type: {item.problemType}</h3>
              <p><strong>Priority:</strong> {item.priority}</p>
              <p><strong>Status:</strong> {item.status}</p>
              <p><strong>Merge Count:</strong> {item.mergeCount}</p>
              <p><strong>AI Summary:</strong> {item.aiSummary}</p>
            </article>
          ))}
        </div>
      )}

      {selectedComplaint && (
        <ComplaintDetailModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          onStatusUpdated={fetchIncoming}
        />
      )}
    </section>
  );
}

export default IncomingComplaints;