import { useState, useEffect } from "react";
import api from "../../api/axios.js";

function EvidenceGallery() {
  const [evidences, setEvidences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/citizen/evidences")
      .then((res) => setEvidences(res.data.evidences))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (evidenceId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this evidence?");
    if (!isConfirmed) return;

    try {
      await api.delete(`/citizen/evidence/${evidenceId}`);
      setEvidences(evidences.filter((ev) => ev._id !== evidenceId));
      alert("Evidence deleted!");
    } catch (error) {
      console.error(error);
      alert("Failed to delete evidence.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-16">
        <div className="ns-spinner" />
      </div>
    );

  return (
    <div>
      <h2 className="font-display font-bold text-xl mb-1" style={{ color: "var(--ink)" }}>
        My evidences
      </h2>
      <p className="text-sm mb-6" style={{ color: "var(--ink-soft)" }}>
        Photos captured with a verified location, ready to attach to a complaint.
      </p>

      {evidences.length === 0 ? (
        <div className="ns-card text-center py-14 px-6">
          <span className="text-3xl block mb-2">&#9723;</span>
          <p className="font-semibold" style={{ color: "var(--ink)" }}>No evidence captured yet</p>
          <p className="text-sm mt-1" style={{ color: "var(--ink-soft)" }}>
            Use "Capture evidence" from the menu to add your first photo.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 pb-6">
          {evidences.map((ev) => (
            <div key={ev._id} className="ns-card relative overflow-hidden">
              <button
                onClick={() => handleDelete(ev._id)}
                className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full shadow-md z-10 text-white"
                style={{ background: "var(--brick)" }}
                title="Delete evidence"
              >
                &#128465;
              </button>

              <img
                src={`http://localhost:3000/${ev.imagePath}`}
                className="w-full h-40 object-cover"
                alt="Captured evidence"
              />
              <div className="p-2.5">
                <span className="text-xs font-mono" style={{ color: "var(--ink-soft)" }}>
                  {new Date(ev.capturedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EvidenceGallery;
