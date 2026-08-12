import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

import CitizenMenu from "./CitizenMenu.jsx";
import CaptureEvidence from "./CaptureEvidence.jsx";
import MakeComplaint from "./MakeComplaint.jsx";
import MyComplaints from "./MyComplaints.jsx";
import EvidenceGallery from "./EvidenceGallery.jsx";
import BrandMark from "../../components/BrandMark.jsx";

const NAV_ITEMS = [
  { to: "/citizen", label: "Home", icon: "\u2302" },
  { to: "/citizen/capture", label: "Capture", icon: "\u25CE" },
  { to: "/citizen/my-complaints", label: "Status", icon: "\u2261" },
];

function CitizenHome() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col font-body" style={{ background: "var(--paper)" }}>
      {/* Top header */}
      <header
        className="px-5 py-4 flex justify-between items-center sticky top-0 z-40"
        style={{ background: "var(--teal)", color: "#fdfdfb" }}
      >
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10">
            <BrandMark size={17} />
          </span>
          <div>
            <p className="font-display font-bold text-[0.95rem] leading-tight">Nagrik-Setu</p>
            <p className="text-[0.72rem] opacity-75 leading-tight">
              Hi, {user?.fullName || user?.username}
            </p>
          </div>
        </div>
        <button onClick={handleLogout} className="ns-btn text-xs px-3 py-1.5" style={{ background: "rgba(255,255,255,0.14)", color: "#fdfdfb" }}>
          Logout
        </button>
      </header>

      {/* Routed content */}
      <main className="flex-grow pb-24 px-4 sm:px-8 pt-5 max-w-3xl w-full mx-auto">
        <Routes>
          <Route index element={<CitizenMenu />} />
          <Route path="capture" element={<CaptureEvidence />} />
          <Route path="make-complaint" element={<MakeComplaint />} />
          <Route path="evidences" element={<EvidenceGallery />} />
          <Route path="my-complaints" element={<MyComplaints />} />
        </Routes>
      </main>

      {/* Bottom nav */}
      <nav
        className="fixed bottom-0 w-full flex justify-around items-center py-2.5 z-50"
        style={{ background: "var(--paper-card)", borderTop: "1px solid var(--border)" }}
      >
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex flex-col items-center text-[0.72rem] font-medium gap-0.5 px-4 py-1 rounded-lg transition-colors"
            style={{ color: isActive(item.to) ? "var(--teal)" : "var(--ink-faint)" }}
          >
            <span className="text-lg leading-none">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default CitizenHome;
