import { useState, useEffect } from "react";
import api from "../../api/axios.js";

function EvidenceGallery() {
    const [evidences, setEvidences] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/citizen/evidences")
           .then(res => setEvidences(res.data.evidences))
           .catch(err => console.error(err))
           .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="text-center mt-10 text-gray-500">Loading evidence...</p>;

    return (
        <div>
            <h2 className="text-xl font-bold mb-4 text-gray-800">My Evidences</h2>
            
            {evidences.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No evidence captured yet.</p>
            ) : (
                <div className="grid grid-cols-2 gap-3">
                    {evidences.map(ev => (
                        <div key={ev._id} className="relative rounded-xl overflow-hidden shadow-sm">
                            <img 
                                src={`http://localhost:3000/${ev.imagePath}`} 
                                className="w-full h-40 object-cover" 
                                alt="Captured Evidence" 
                            />
                            <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/70 to-transparent p-2 pt-6">
                                <span className="text-xs text-white font-medium">
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