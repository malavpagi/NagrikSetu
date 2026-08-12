import { useState } from "react";
import api from "../../api/axios.js"; 

function CaptureEvidence() {
    const [loadingMsg, setLoadingMsg] = useState("");

    const handleCaptureAndUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoadingMsg("Acquiring Secure GPS Lock...");
        
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

                setLoadingMsg("Uploading Evidence securely...");
                
                // 2. Bundle the Photo and the fresh GPS data
                const formData = new FormData();
                formData.append("image", file);
                formData.append("latitude", lat);
                formData.append("longitude", lng);
                formData.append("capturedAt", new Date().toISOString()); 

                // 3. Send to Backend
                try {
                    await api.post("/citizen/evidence", formData);
                    alert("Evidence Captured Successfully!");
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
            <h2 className="text-xl font-bold mb-6 text-gray-800">Capture Evidence</h2>
            
            <p className="text-sm text-gray-500 mb-6 text-center px-4">
                Location data is recorded at the exact moment the photo is taken to prevent fraud.
            </p>

            <label className="bg-blue-600 text-white px-6 py-4 rounded-xl w-full text-center cursor-pointer block font-bold shadow-md active:bg-blue-700">
                📸 Open Camera & Snap Photo
                {/* Desktop: Opens File Picker. Mobile: Opens Camera. */}
                <input 
                    type="file" 
                    accept="image/*" 
                    capture="environment" 
                    className="hidden" 
                    onChange={handleCaptureAndUpload} 
                />
            </label>
            
            {loadingMsg && (
                <div className="mt-6 flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                    <p className="text-gray-600 font-medium text-center animate-pulse">
                        {loadingMsg}
                    </p>
                </div>
            )}
        </div>
    );
}

export default CaptureEvidence;