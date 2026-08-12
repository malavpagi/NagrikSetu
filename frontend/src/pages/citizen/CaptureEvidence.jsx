import { useState } from "react";
import api from "../../api/axios.js";

function CaptureEvidence() {
  const [loadingMsg, setLoadingMsg] = useState("");

  const handleCaptureAndUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoadingMsg("Acquiring secure GPS lock…");

    // 1. Immediately request GPS the moment the photo is selected/taken
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setLoadingMsg("");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setLoadingMsg("Uploading evidence securely…");

        // 2. Bundle the Photo and the fresh GPS data
        const formData = new FormData();
        formData.append("image", file);
        formData.append("latitude", lat);
        formData.append("longitude", lng);
        formData.append("capturedAt", new Date().toISOString());

        // 3. Send to Backend
        try {
          await api.post("/citizen/evidence", formData);
          alert("Evidence captured successfully!");
          setLoadingMsg("");

          // Reset the input so they can take another photo if they want
          e.target.value = null;
        } catch (error) {
          console.error(error);
          alert(error.response?.data?.error || "Upload failed.");
          setLoadingMsg("");
        }
      },
      (err) => {
        // If they deny GPS after taking the photo, we reject the upload!
        alert("Location permission is mandatory to capture evidence. Upload aborted.");
        setLoadingMsg("");
        e.target.value = null;
      },
      { enableHighAccuracy: true, maximumAge: 0 } // maximumAge: 0 forces a brand new GPS ping, no caching!
    );
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="font-display font-bold text-xl mb-1 self-start" style={{ color: "var(--ink)" }}>
        Capture evidence
      </h2>
      <p className="text-sm mb-7 self-start" style={{ color: "var(--ink-soft)" }}>
        Location is recorded the instant the photo is taken, to keep every report verifiable.
      </p>

      <label
        className="w-full text-center cursor-pointer block ns-btn ns-btn-accent py-10 text-base rounded-2xl"
        style={{ border: "1.5px dashed var(--marigold-dark)" }}
      >
        <span className="text-3xl block mb-2">&#9673;</span>
        Open camera &amp; snap photo
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleCaptureAndUpload}
        />
      </label>

      <p className="text-xs mt-4 text-center px-4" style={{ color: "var(--ink-faint)" }}>
        Desktop opens a file picker · mobile opens your camera directly.
      </p>

      {loadingMsg && (
        <div className="mt-8 flex flex-col items-center gap-3 ns-card px-6 py-5 w-full">
          <div className="ns-spinner" />
          <p className="font-medium text-sm text-center" style={{ color: "var(--ink)" }}>
            {loadingMsg}
          </p>
        </div>
      )}
    </div>
  );
}

export default CaptureEvidence;
