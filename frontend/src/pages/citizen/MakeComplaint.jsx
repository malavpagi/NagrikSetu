import { useState } from "react";
import api from "../../api/axios.js";

function MakeComplaint() {
  const [evidences, setEvidences] = useState([]);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [description, setDescription] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [showGallery, setShowGallery] = useState(false);
  const [loading, setLoading] = useState(false);

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
        contactNumber: contactNumber, // Optional privacy feature
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
      <h2 className="font-display font-bold text-xl mb-1" style={{ color: "var(--ink)" }}>
        Register a complaint
      </h2>
      <p className="text-sm mb-6" style={{ color: "var(--ink-soft)" }}>
        Attach a photo, describe the problem, and we'll route it to the right department.
      </p>

      {!selectedEvidence ? (
        <button
          onClick={openGallery}
          className="w-full py-12 rounded-2xl font-semibold mb-5"
          style={{
            background: "var(--paper-card)",
            border: "2px dashed var(--border)",
            color: "var(--ink-soft)",
          }}
        >
          + Choose from captured evidence
        </button>
      ) : (
        <div className="relative mb-5 ns-card overflow-hidden">
          <img
            src={`http://localhost:3000/${selectedEvidence.imagePath}`}
            className="w-full h-48 object-cover"
            alt="Selected evidence"
          />
          <button
            onClick={() => setSelectedEvidence(null)}
            className="absolute top-2 right-2 ns-btn ns-btn-danger text-xs py-1 px-3"
            style={{ background: "rgba(255,255,255,0.92)" }}
          >
            Change
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="ns-field">Description</label>
          <textarea
            placeholder="Describe the issue in detail…"
            className="ns-input"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="ns-field">Mobile number (optional)</label>
          <input
            type="tel"
            placeholder="For updates on this complaint"
            className="ns-input"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
          />
        </div>

        <button type="submit" disabled={loading} className="ns-btn ns-btn-primary mt-1">
          {loading ? "AI analyzing & submitting…" : "Submit complaint"}
        </button>
      </form>

      {showGallery && (
        <div
          className="fixed inset-0 p-4 z-[60] overflow-y-auto flex flex-col ns-scrollbar"
          style={{ background: "rgba(20, 26, 23, 0.92)" }}
        >
          <div className="flex justify-between items-center mb-6 mt-4">
            <h3 className="text-white text-lg font-display font-bold">Select evidence</h3>
            <button
              onClick={() => setShowGallery(false)}
              className="text-white text-sm px-4 py-1.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              Close
            </button>
          </div>
          {evidences.length === 0 && (
            <p className="text-center mt-10" style={{ color: "rgba(255,255,255,0.6)" }}>
              No unused evidence found.
            </p>
          )}
          <div className="grid grid-cols-2 gap-3">
            {evidences.map((ev) => (
              <img
                key={ev._id}
                src={`http://localhost:3000/${ev.imagePath}`}
                className="w-full h-40 object-cover rounded-xl cursor-pointer border-2 border-transparent"
                style={{ transition: "border-color 0.15s ease" }}
                onClick={() => {
                  setSelectedEvidence(ev);
                  setShowGallery(false);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MakeComplaint;
