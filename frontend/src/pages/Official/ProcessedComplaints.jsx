import { useState, useEffect } from "react";
import { getOfficialComplaintsApi } from "../../api/official.api";
import ComplaintDetailModal from "./ComplaintDetailModal";
import StatusStamp from "../../components/StatusStamp.jsx";

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

  if (loading) return <div className="ns-state"><div className="ns-spinner" />Loading processed complaints…</div>;
  if (error) return <div className="ns-state ns-state-error">{error}</div>;

  return (
    <section>
      <div className="ns-page-head">
        <div>
          <p className="ns-page-eyebrow">Queue</p>
          <h2>Resolved &amp; rejected</h2>
        </div>
      </div>

      {complaints.length === 0 ? (
        <p className="ns-empty">No processed complaints found.</p>
      ) : (
        <div className="ns-card-list">
          {complaints.map((item) => (
            <article key={item._id} className="ns-card ns-card-clickable" onClick={() => setSelectedComplaint(item)}>
              <div className="ns-record-head">
                <div className="ns-record-title">{item.problemType}</div>
                <StatusStamp status={item.status} />
              </div>
              <p className="ns-quote">{item.aiSummary}</p>
              <div className="ns-record-meta" style={{ gridTemplateColumns: "1fr 1fr" }}>
                <p><b>Priority:</b> {item.priority}</p>
                <p><b>Merged reports:</b> {item.mergeCount}</p>
                {item.rejectionReason && (
                  <p style={{ gridColumn: "1 / -1" }}><b>Rejection reason:</b> {item.rejectionReason}</p>
                )}
              </div>
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
