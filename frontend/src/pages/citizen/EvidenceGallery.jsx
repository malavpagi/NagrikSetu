import { useState, useEffect } from "react";
import api from "../../api/axios.js";
import { IconTrash } from "../../components/icons.jsx";

function EvidenceGallery() {
  const [evidences, setEvidences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/citizen/evidences")
      .then(res => setEvidences(res.data.evidences))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (evidenceId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this evidence?");
    if (!isConfirmed) return;

    try {
      await api.delete(`/citizen/evidence/${evidenceId}`);
      // Remove the deleted image from the screen immediately
      setEvidences(evidences.filter(ev => ev._id !== evidenceId));
      alert("Evidence deleted!");
    } catch (error) {
      console.error(error);
      alert("Failed to delete evidence.");
    }
  };

  if (loading) return <div className="ns-state"><div className="ns-spinner" />Loading evidence…</div>;

  return (
    <div>
      <div className="ns-page-eyebrow">Evidence</div>
      <h2 style={{ marginBottom: 16 }}>My evidence</h2>

      {evidences.length === 0 ? (
        <p className="ns-empty">No evidence captured yet.</p>
      ) : (
        <div className="ns-evidence-grid">
          {evidences.map(ev => (
            <div key={ev._id} className="ns-evidence-tile">
              <button
                onClick={() => handleDelete(ev._id)}
                className="ns-evidence-remove"
                title="Delete evidence"
              >
                <IconTrash />
              </button>

              <img
                src={`http://localhost:3000/${ev.imagePath}`}
                alt="Captured evidence"
              />
              <div className="ns-evidence-date">
                {new Date(ev.capturedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EvidenceGallery;
