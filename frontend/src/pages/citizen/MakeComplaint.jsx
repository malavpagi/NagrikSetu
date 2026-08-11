import { useState, useEffect } from "react";
import api from "../../api/axios.js";

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
            <h2 className="text-xl font-bold mb-4 text-gray-800">Register Complaint</h2>

            {/* Image Selector */}
            {!selectedEvidence ? (
                <button 
                    onClick={openGallery} 
                    className="bg-gray-50 border-2 border-dashed border-gray-400 w-full py-12 rounded-xl text-gray-600 font-semibold mb-4 active:bg-gray-100"
                >
                    + Choose from Captured Evidence
                </button>
            ) : (
                <div className="relative mb-4">
                    <img 
                        src={`http://localhost:3000/${selectedEvidence.imagePath}`} 
                        className="w-full h-48 object-cover rounded-xl shadow-sm" 
                        alt="Selected Evidence" 
                    />
                    <button 
                        onClick={() => setSelectedEvidence(null)} 
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-3 py-1 text-sm font-bold shadow"
                    >
                        Change
                    </button>
                </div>
            )}

            {/* Complaint Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <textarea 
                    placeholder="Describe the issue in detail..." 
                    className="w-full p-4 border rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                
                {/* Optional Contact info (Section 13) */}
                <input 
                    type="tel"
                    placeholder="Mobile Number (Optional)"
                    className="w-full p-4 border rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                />

                <button 
                    type="submit" 
                    disabled={loading} 
                    className={`p-4 rounded-xl font-bold text-white shadow-md transition-colors ${loading ? "bg-gray-400" : "bg-blue-600 active:bg-blue-700"}`}
                >
                    {loading ? "AI Analyzing & Submitting..." : "Submit Complaint"}
                </button>
            </form>

            {/* Gallery Modal */}
            {showGallery && (
                <div className="fixed inset-0 bg-black bg-opacity-90 p-4 z-[60] overflow-y-auto flex flex-col">
                    <div className="flex justify-between items-center mb-6 mt-4">
                        <h3 className="text-white text-xl font-bold">Select Evidence</h3>
                        <button onClick={() => setShowGallery(false)} className="text-white text-lg bg-gray-800 px-4 py-1 rounded-full">Close</button>
                    </div>
                    {evidences.length === 0 && <p className="text-gray-400 text-center mt-10">No unused evidence found.</p>}
                    <div className="grid grid-cols-2 gap-3">
                        {evidences.map((ev) => (
                            <img 
                                key={ev._id} 
                                src={`http://localhost:3000/${ev.imagePath}`} 
                                className="w-full h-40 object-cover rounded-lg cursor-pointer border-2 border-transparent active:border-blue-500"
                                onClick={() => { setSelectedEvidence(ev); setShowGallery(false); }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default MakeComplaint;