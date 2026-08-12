import { useState } from "react";
import api from "../../api/axios.js";
import { IconCamera } from "../../components/icons.jsx";

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
          await api.post("/citizen/evidence", formData, {
            headers: { "Content-Type": "multipart/form-data" }
          });
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
    <div className="ns-capture">
      <div className="ns-page-eyebrow">Evidence</div>
      <h2 style={{ marginBottom: 10 }}>Capture evidence</h2>

      <p className="ns-capture-note">
        Location is recorded the moment the photo is taken, so it can't be
        edited or faked afterwards.
      </p>

      <label className="ns-capture-label">
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
          <IconCamera /> Open camera &amp; take photo
        </span>
        {/* Desktop: Opens File Picker. Mobile: Opens Camera. */}
        <input
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: "none" }}
          onChange={handleCaptureAndUpload}
        />
      </label>

      {loadingMsg && (
        <div className="ns-capture-progress">
          <div className="ns-spinner" style={{ margin: 0 }} />
          <p style={{ margin: 0 }}>{loadingMsg}</p>
        </div>
      )}
    </div>
  );
}

export default CaptureEvidence;
