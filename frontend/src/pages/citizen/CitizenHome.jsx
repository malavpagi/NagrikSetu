import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

// Import the sub-pages
import CitizenMenu from "./CitizenMenu.jsx";
import CaptureEvidence from "./CaptureEvidence.jsx";
import MakeComplaint from "./MakeComplaint.jsx";
import MyComplaints from "./MyComplaints.jsx";
import EvidenceGallery from "./EvidenceGallery.jsx";
import { IconHome, IconCamera, IconList, IconLogout } from "../../components/icons.jsx";
import "../../styles/global.css";

function CitizenHome() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path ? "ns-bottom-nav-item active" : "ns-bottom-nav-item";

  return (
    <div className="ns-app">
      <header className="ns-topbar">
        <div className="ns-brand">
          <div className="ns-brand-mark">
            Nagrik Setu
            <small>Citizen portal</small>
          </div>
        </div>
        <div className="ns-topbar-meta">
          <strong>{user?.fullName || user?.username}</strong>
          <div>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
              <IconLogout width={15} height={15} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="ns-main">
        <Routes>
          <Route index element={<CitizenMenu />} />
          <Route path="capture" element={<CaptureEvidence />} />
          <Route path="make-complaint" element={<MakeComplaint />} />
          <Route path="evidences" element={<EvidenceGallery />} />
          <Route path="my-complaints" element={<MyComplaints />} />
        </Routes>
      </main>

      <nav className="ns-bottom-nav">
        <Link to="/citizen" className={isActive('/citizen')}>
          <IconHome />
          <span>Home</span>
        </Link>
        <Link to="/citizen/capture" className={isActive('/citizen/capture')}>
          <IconCamera />
          <span>Capture</span>
        </Link>
        <Link to="/citizen/my-complaints" className={isActive('/citizen/my-complaints')}>
          <IconList />
          <span>Status</span>
        </Link>
      </nav>
    </div>
  );
}

export default CitizenHome;
