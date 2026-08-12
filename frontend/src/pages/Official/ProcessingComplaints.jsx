import { useState, useEffect } from "react";
import { getOfficialComplaintsApi } from "../../api/official.api";
import ComplaintDetailModal from "./ComplaintDetailModal";
import StatusStamp from "../../components/StatusStamp.jsx";

function ProcessingComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const fetchProcessing = async () => {
    try {
      setLoading(true);
      const res = await getOfficialComplaintsApi("processing");
      setComplaints(res.data || res);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch processing complaints.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProcessing();
  }, []);

  if (loading) return <div className="ns-state"><div className="ns-spinner" />Loading processing complaints…</div>;
  if (error) return <div className="ns-state ns-state-error">{error}</div>;

  return (
    <section>
      <div className="ns-page-head">
        <div>
          <p className="ns-page-eyebrow">Queue</p>
          <h2>Work in progress</h2>
        </div>
      </div>

      {complaints.length === 0 ? (
        <p className="ns-empty">No processing complaints found.</p>
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
              </div>
            </article>
          ))}
        </div>
      )}

      {selectedComplaint && (
        <ComplaintDetailModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          onStatusUpdated={fetchProcessing}
        />
      )}
    </section>
  );
}

export default ProcessingComplaints;
