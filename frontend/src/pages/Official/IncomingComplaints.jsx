import { useState, useEffect } from "react";
import { getOfficialComplaintsApi, updateComplaintStatusApi } from "../../api/official.api";
import ComplaintDetailModal from "./ComplaintDetailModal";
import ComplaintCard from "../../components/ComplaintCard.jsx";

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

  if (loading)
    return (
      <div className="flex justify-center py-16">
        <div className="ns-spinner" />
      </div>
    );
  if (error) return <div className="ns-card p-5" style={{ color: "var(--brick)" }}>{error}</div>;

  return (
    <section>
      <h2 className="font-display font-bold text-xl mb-1" style={{ color: "var(--ink)" }}>
        Incoming complaints
      </h2>
      <p className="text-sm mb-6" style={{ color: "var(--ink-soft)" }}>
        New reports awaiting review. Opening one moves it into review automatically.
      </p>

      {complaints.length === 0 ? (
        <div className="ns-card text-center py-14 px-6">
          <p className="font-semibold" style={{ color: "var(--ink)" }}>Nothing incoming right now</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3.5">
          {complaints.map((item) => (
            <ComplaintCard key={item._id} item={item} onClick={() => handleCardClick(item)} />
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
