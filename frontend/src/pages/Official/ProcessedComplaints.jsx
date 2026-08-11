import { useState, useEffect } from "react";
import { getOfficialComplaintsApi } from "../../api/official.api";
import ComplaintDetailModal from "./ComplaintDetailModal";

function ProcessedComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const fetchProcessed = async () => {
    try {
      setLoading(true);
      const res = await getOfficialComplaintsApi("processed");
      setComplaints(res.data || res);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch processed complaints.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProcessed();
  }, []);

  if (loading) return <div>Loading processed complaints...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section>
      <h2>Processed Complaints (Resolved / Rejected)</h2>
      {complaints.length === 0 ? (
        <p>No processed complaints found.</p>
      ) : (
        <div>
          {complaints.map((item) => (
            <article
              key={item._id}
              onClick={() => setSelectedComplaint(item)}
              style={{ border: "1px solid #333", padding: "10px", marginBottom: "10px", cursor: "pointer" }}
            >
              <h3>Type: {item.problemType}</h3>
              <p><strong>Priority:</strong> {item.priority}</p>
              <p><strong>Status:</strong> {item.status}</p>
              {item.rejectionReason && <p><strong>Rejection Reason:</strong> {item.rejectionReason}</p>}
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
          onStatusUpdated={fetchProcessed}
        />
      )}
    </section>
  );
}

export default ProcessedComplaints;