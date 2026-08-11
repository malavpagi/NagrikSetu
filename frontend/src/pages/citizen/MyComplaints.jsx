import { useState, useEffect } from "react";
import api from "../../api/axios.js";

function MyComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const res = await api.get("/citizen/complaints");
                setComplaints(res.data.complaints);
            } catch (error) {
                console.error("Failed to load complaints");
            } finally {
                setLoading(false);
            }
        };
        fetchComplaints();
    }, []);

    const getStatusStyle = (status) => {
        switch(status) {
            case "RESOLVED": return "bg-green-100 text-green-800 border-green-200";
            case "REJECTED": return "bg-red-100 text-red-800 border-red-200";
            case "WORK_IN_PROGRESS": return "bg-blue-100 text-blue-800 border-blue-200";
            case "UNDER_REVIEW": return "bg-yellow-100 text-yellow-800 border-yellow-200";
            default: return "bg-gray-100 text-gray-800 border-gray-200"; // SUBMITTED
        }
    };

    if (loading) return <p className="text-center mt-10 text-gray-500">Loading complaints...</p>;

    return (
        <div>
            <h2 className="text-xl font-bold mb-4 text-gray-800">My Complaints</h2>
            
            <div className="flex flex-col gap-4">
                {complaints.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No complaints found.</p>
                ) : null}
                
                {complaints.map(complaint => (
                    <div key={complaint._id} className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white">
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="font-bold text-gray-800">{complaint.problemType}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full font-bold border ${getStatusStyle(complaint.status)}`}>
                                {complaint.status.replace(/_/g, " ")}
                            </span>
                        </div>
                        
                        <p className="text-sm text-gray-700 font-medium mb-3">"{complaint.aiSummary}"</p>
                        
                        <div className="text-xs text-gray-500 flex flex-col gap-1 pt-3 border-t">
                            <p><span className="font-semibold">Location:</span> {complaint.locations[0]?.textLocation}</p>
                            <p><span className="font-semibold">Dept:</span> {complaint.departmentId?.name || "Assigned"}</p>
                            <p><span className="font-semibold">Date:</span> {new Date(complaint.createdAt).toLocaleDateString()}</p>
                            <p><span className="font-semibold">Tracking ID:</span> {complaint.complaintIds[0]}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MyComplaints;