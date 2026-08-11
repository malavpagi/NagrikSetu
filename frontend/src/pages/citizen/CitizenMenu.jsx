import { useNavigate } from "react-router-dom";

function CitizenMenu() {
    const navigate = useNavigate();

    return (
        <div className="h-full flex flex-col">
            <h2 className="text-lg font-bold text-gray-700 mb-4">What would you like to do?</h2>

            {/* The 4 Main Buttons Grid */}
            <div className="grid grid-cols-2 gap-4 flex-grow content-start">
                
                <button 
                    onClick={() => navigate('/citizen/capture')}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center gap-3 active:bg-gray-50 transition-colors"
                >
                    <div className="bg-blue-100 p-3 rounded-full text-2xl">📸</div>
                    <span className="font-semibold text-gray-700 text-center text-sm">Capture Evidence</span>
                </button>

                <button 
                    onClick={() => navigate('/citizen/make-complaint')}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center gap-3 active:bg-gray-50 transition-colors"
                >
                    <div className="bg-orange-100 p-3 rounded-full text-2xl">📝</div>
                    <span className="font-semibold text-gray-700 text-center text-sm">Make Complaint</span>
                </button>

                <button 
                    onClick={() => navigate('/citizen/evidences')}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center gap-3 active:bg-gray-50 transition-colors"
                >
                    <div className="bg-purple-100 p-3 rounded-full text-2xl">🖼️</div>
                    <span className="font-semibold text-gray-700 text-center text-sm">My Evidences</span>
                </button>

                <button 
                    onClick={() => navigate('/citizen/my-complaints')}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center gap-3 active:bg-gray-50 transition-colors"
                >
                    <div className="bg-green-100 p-3 rounded-full text-2xl">📋</div>
                    <span className="font-semibold text-gray-700 text-center text-sm">My Complaints</span>
                </button>

            </div>
        </div>
    );
}

export default CitizenMenu;