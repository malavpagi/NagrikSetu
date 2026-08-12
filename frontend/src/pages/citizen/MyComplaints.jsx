import { useState, useEffect } from "react";
import api from "../../api/axios.js";
import StatusStamp from "../../components/StatusStamp.jsx";

function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await api.get("/citizen/complaints");
        setComplaints(res.data.complaints);
      } catch (error) {
        console.error("Failed to load complaints");
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  if (loading) return <div className="ns-state"><div className="ns-spinner" />Loading complaints…</div>;

  return (
    <div>
      <div className="ns-page-eyebrow">Tracking</div>
      <h2 style={{ marginBottom: 16 }}>My complaints</h2>

      {complaints.length === 0 ? (
        <p className="ns-empty">No complaints found.</p>
      ) : (
        <div className="ns-card-list">
          {complaints.map(complaint => (
            <div key={complaint._id} className="ns-card">
              <div className="ns-record-head">
                <div className="ns-record-title">{complaint.problemType}</div>
                <StatusStamp status={complaint.status} />
              </div>

              <p className="ns-quote">{complaint.aiSummary}</p>

              <div className="ns-record-meta">
                <p><b>Location:</b> {complaint.locations[0]?.textLocation}</p>
                <p><b>Department:</b> {complaint.departmentId?.name || "Assigned"}</p>
                <p><b>Date:</b> {new Date(complaint.createdAt).toLocaleDateString()}</p>
                <p><b>Tracking ID:</b> <span className="ns-mono">{complaint.complaintIds[0]}</span></p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyComplaints;
