import { useState } from "react";
import api from "../../api/axios.js";
import { IconClose } from "../../components/icons.jsx";

function MakeComplaint() {
  const [evidences, setEvidences] = useState([]);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [description, setDescription] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [showGallery, setShowGallery] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch evidences when modal opens
  const openGallery = async () => {
    try {
      const res = await api.get("/citizen/evidences");
      setEvidences(res.data.evidences);
      setShowGallery(true);
    } catch (error) {
      alert("Failed to load evidence gallery");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEvidence) return alert("Please select an evidence image first!");

    setLoading(true);
    try {
      const res = await api.post("/citizen/complaint", {
        evidenceId: selectedEvidence._id,
        description: description,
        contactNumber: contactNumber // Optional privacy feature
      });
      alert(`Success! ${res.data.isMerged ? "Merged with existing issue." : "New complaint created."}`);
      setSelectedEvidence(null);
      setDescription("");
      setContactNumber("");
    } catch (error) {
      alert(error.response?.data?.reason || error.response?.data?.error || "AI Rejected or Error Occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="ns-page-eyebrow">New report</div>
      <h2 style={{ marginBottom: 16 }}>Register complaint</h2>

      {/* Image Selector */}
      {!selectedEvidence ? (
        <button onClick={openGallery} className="ns-dropzone" style={{ marginBottom: 18 }}>
          + Choose from captured evidence
        </button>
      ) : (
        <div className="ns-selected-evidence" style={{ marginBottom: 18 }}>
          <img
            src={`http://localhost:3000/${selectedEvidence.imagePath}`}
            alt="Selected evidence"
          />
          <button onClick={() => setSelectedEvidence(null)} className="btn btn-sm" style={{ background: "rgba(38,36,32,0.72)", color: "#fff" }}>
            Change
          </button>
        </div>
      )}

      {/* Complaint Form */}
      <form onSubmit={handleSubmit} className="ns-form">
        <div className="field">
          <label className="field-label" htmlFor="description">Describe the issue</label>
          <textarea
            id="description"
            className="ns-input"
            placeholder="What's happening, and where exactly?"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label className="field-label" htmlFor="contactNumber">Mobile number (optional)</label>
          <input
            id="contactNumber"
            type="tel"
            placeholder="For updates on this complaint"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
          />
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary btn-block">
          {loading ? "Analysing & submitting…" : "Submit complaint"}
        </button>
      </form>

      {/* Gallery Modal */}
      {showGallery && (
        <div className="ns-modal-overlay">
          <div className="ns-modal-head" style={{ maxWidth: 720, margin: "0 auto 16px" }}>
            <h3 style={{ color: "#fff" }}>Select evidence</h3>
            <button className="ns-modal-close" onClick={() => setShowGallery(false)} aria-label="Close">
              <IconClose width={15} height={15} />
            </button>
          </div>
          {evidences.length === 0 && (
            <p className="ns-muted" style={{ textAlign: "center", color: "#d8d3c4" }}>No unused evidence found.</p>
          )}
          <div className="ns-evidence-grid" style={{ maxWidth: 720, margin: "0 auto" }}>
            {evidences.map((ev) => (
              <button
                key={ev._id}
                className="ns-evidence-tile ns-evidence-pick"
                onClick={() => { setSelectedEvidence(ev); setShowGallery(false); }}
              >
                <img src={`http://localhost:3000/${ev.imagePath}`} alt="Evidence option" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MakeComplaint;
