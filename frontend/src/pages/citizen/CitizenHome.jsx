// import {Routes, Route} from "react-router-dom";

// import HomePage from "./HomePage";
// import ProfilePage from "./ProfilePage";

// function CitizenHome(){
//     return (<>
//         <h1>This is Citizen Dashboard</h1>
//         <Routes>
//             <Route index element={<HomePage />} />
//             <Route path="profile" element={<ProfilePage />} />
//         </Routes>
//     </>);
// }
// export default CitizenHome;

import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

// Import the sub-pages (we will build these next)
import CitizenMenu from "./CitizenMenu.jsx"; // The page with the 4 buttons
import CaptureEvidence from "./CaptureEvidence.jsx";
import MakeComplaint from "./MakeComplaint.jsx";
import MyComplaints from "./MyComplaints.jsx";
import EvidenceGallery from "./EvidenceGallery.jsx";

function CitizenHome() {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // Helper to highlight active bottom nav link
    const isActive = (path) => location.pathname === path ? 'text-blue-600 font-bold' : 'text-gray-500';

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* --- TOP HEADER --- */}
            <header className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold">Citizen Portal</h1>
                    <p className="text-blue-100 text-sm">Hello, {user?.fullName || user?.username}</p>
                </div>
                <button onClick={handleLogout} className="text-sm bg-blue-700 px-3 py-1 rounded hover:bg-blue-800">
                    Logout
                </button>
            </header>

            {/* --- MAIN CONTENT AREA (Nested Routes) --- */}
            {/* pb-20 ensures content isn't hidden behind the bottom nav */}
            <main className="flex-grow pb-20 p-4">
                <Routes>
                    {/* Default route shows the 4 buttons menu */}
                    <Route index element={<CitizenMenu />} />
                    <Route path="capture" element={<CaptureEvidence />} />
                    <Route path="make-complaint" element={<MakeComplaint />} />
                    <Route path="evidences" element={<EvidenceGallery />} />
                    <Route path="my-complaints" element={<MyComplaints />} />
                </Routes>
            </main>

            {/* --- MOBILE BOTTOM NAVIGATION --- */}
            <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] flex justify-around items-center p-3 z-50">
                <Link to="/citizen" className={`flex flex-col items-center text-sm ${isActive('/citizen')}`}>
                    <span className="text-xl">🏠</span>
                    <span>Home</span>
                </Link>
                <Link to="/citizen/capture" className={`flex flex-col items-center text-sm ${isActive('/citizen/capture')}`}>
                    <span className="text-xl text-blue-500">📸</span>
                    <span>Capture</span>
                </Link>
                <Link to="/citizen/my-complaints" className={`flex flex-col items-center text-sm ${isActive('/citizen/my-complaints')}`}>
                    <span className="text-xl">📋</span>
                    <span>Status</span>
                </Link>
            </nav>
        </div>
    );
}

export default CitizenHome;