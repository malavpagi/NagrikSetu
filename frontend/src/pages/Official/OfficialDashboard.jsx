import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

import IncomingComplaints from "./IncomingComplaints.jsx";
import ProcessingComplaints from "./ProcessingComplaints.jsx";
import ProcessedComplaints from "./ProcessedComplaints.jsx";
import HeatMap from "./HeatMap.jsx";
import BrandMark from "../../components/BrandMark.jsx";

const NAV_ITEMS = [
  { to: "/official/incoming", label: "Incoming" },
  { to: "/official/processing", label: "Processing" },
  { to: "/official/processed", label: "Processed" },
  { to: "/official/heatmap", label: "Heat map" },
];

function OfficialDashboard() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen font-body" style={{ background: "var(--paper)" }}>
      <header
        className="px-5 sm:px-8 py-4 flex flex-wrap gap-3 justify-between items-center sticky top-0 z-40"
        style={{ background: "var(--teal)", color: "#fdfdfb" }}
      >
        <div className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/10">
            <BrandMark size={18} />
          </span>
          <div>
            <p className="font-display font-bold text-[0.95rem] leading-tight">Department Dashboard</p>
            <p className="text-[0.72rem] opacity-75 leading-tight font-mono">
              {user?.fullName || user?.username} · {user?.departmentCode || "OFFICIAL"}
            </p>
          </div>
        </div>
        <button onClick={handleLogout} className="ns-btn text-xs px-3 py-1.5" style={{ background: "rgba(255,255,255,0.14)", color: "#fdfdfb" }}>
          Logout
        </button>
      </header>

      <nav
        className="flex gap-1.5 px-5 sm:px-8 py-3 overflow-x-auto ns-scrollbar sticky top-[65px] z-30"
        style={{ background: "var(--paper)", borderBottom: "1px solid var(--border)" }}
      >
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="text-sm font-semibold px-3.5 py-1.5 rounded-full whitespace-nowrap transition-colors"
            style={
              isActive(item.to)
                ? { background: "var(--teal)", color: "#fdfdfb" }
                : { background: "var(--paper-card)", color: "var(--ink-soft)", border: "1px solid var(--border)" }
            }
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <main className="px-5 sm:px-8 py-6 max-w-5xl mx-auto">
        <Routes>
          <Route index element={<IncomingComplaints />} />
          <Route path="incoming" element={<IncomingComplaints />} />
          <Route path="processing" element={<ProcessingComplaints />} />
          <Route path="processed" element={<ProcessedComplaints />} />
          <Route path="heatmap" element={<HeatMap />} />
        </Routes>
      </main>
    </div>
  );
}

export default OfficialDashboard;
