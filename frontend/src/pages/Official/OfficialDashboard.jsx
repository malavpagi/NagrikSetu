import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

import IncomingComplaints from "./IncomingComplaints.jsx";
import ProcessingComplaints from "./ProcessingComplaints.jsx";
import ProcessedComplaints from "./ProcessedComplaints.jsx";
import HeatMap from "./HeatMap.jsx";
import { IconLogout } from "../../components/icons.jsx";
import "../../styles/global.css";

function OfficialDashboard() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="ns-app">
      <header className="ns-topbar">
        <div className="ns-brand">
          <div className="ns-brand-mark">
            Nagrik Setu
            <small>Department desk</small>
          </div>
        </div>
        <div className="ns-topbar-meta">
          <strong>{user?.fullName || user?.username}</strong> · {user?.departmentCode || "Official"}
          <div>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
              <IconLogout width={15} height={15} /> Logout
            </button>
          </div>
        </div>
      </header>

      <nav className="ns-nav">
        <NavLink to="/official/incoming" className={({ isActive }) => isActive ? "active" : ""}>Incoming</NavLink>
        <NavLink to="/official/processing" className={({ isActive }) => isActive ? "active" : ""}>Processing</NavLink>
        <NavLink to="/official/processed" className={({ isActive }) => isActive ? "active" : ""}>Processed</NavLink>
        <NavLink to="/official/heatmap" className={({ isActive }) => isActive ? "active" : ""}>Heatmap</NavLink>
      </nav>

      <main className="ns-main">
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
