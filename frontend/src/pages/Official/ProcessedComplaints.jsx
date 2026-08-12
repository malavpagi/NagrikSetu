import { useState, useEffect } from "react";
import { getOfficialComplaintsApi } from "../../api/official.api";
import ComplaintDetailModal from "./ComplaintDetailModal";
import ComplaintCard from "../../components/ComplaintCard.jsx";

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
        Processed complaints
      </h2>
      <p className="text-sm mb-6" style={{ color: "var(--ink-soft)" }}>
        Resolved and rejected complaints, kept here for the record.
      </p>

      {complaints.length === 0 ? (
        <div className="ns-card text-center py-14 px-6">
          <p className="font-semibold" style={{ color: "var(--ink)" }}>Nothing processed yet</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3.5">
          {complaints.map((item) => (
            <ComplaintCard key={item._id} item={item} onClick={() => setSelectedComplaint(item)} />
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
