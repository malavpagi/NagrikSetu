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

  if (loading)
    return (
      <div className="flex justify-center py-16">
        <div className="ns-spinner" />
      </div>
    );

  return (
    <div>
      <h2 className="font-display font-bold text-xl mb-1" style={{ color: "var(--ink)" }}>
        My complaints
      </h2>
      <p className="text-sm mb-6" style={{ color: "var(--ink-soft)" }}>
        Every complaint you've filed, and where it stands right now.
      </p>

      <div className="flex flex-col gap-3.5 pb-6">
        {complaints.length === 0 ? (
          <div className="ns-card text-center py-14 px-6">
            <span className="text-3xl block mb-2">&#9776;</span>
            <p className="font-semibold" style={{ color: "var(--ink)" }}>No complaints found</p>
            <p className="text-sm mt-1" style={{ color: "var(--ink-soft)" }}>
              Filed complaints will show up here with live status.
            </p>
          </div>
        ) : null}

        {complaints.map((complaint) => (
          <div key={complaint._id} className="ns-card p-4">
            <div className="flex justify-between items-start mb-3 gap-3">
              <h3 className="font-display font-bold text-[0.95rem]" style={{ color: "var(--ink)" }}>
                {complaint.problemType}
              </h3>
              <StatusStamp status={complaint.status} />
            </div>

            <p className="text-sm italic mb-3" style={{ color: "var(--ink-soft)" }}>
              "{complaint.aiSummary}"
            </p>

            <div
              className="text-xs flex flex-col gap-1 pt-3 font-mono"
              style={{ borderTop: "1px solid var(--border-soft)", color: "var(--ink-faint)" }}
            >
              <p><span className="font-semibold" style={{ color: "var(--ink-soft)" }}>Location</span> — {complaint.locations[0]?.textLocation}</p>
              <p><span className="font-semibold" style={{ color: "var(--ink-soft)" }}>Dept</span> — {complaint.departmentId?.name || "Assigned"}</p>
              <p><span className="font-semibold" style={{ color: "var(--ink-soft)" }}>Date</span> — {new Date(complaint.createdAt).toLocaleDateString()}</p>
              <p><span className="font-semibold" style={{ color: "var(--ink-soft)" }}>Tracking ID</span> — {complaint.complaintIds[0]}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyComplaints;
