import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

import ActiveOfficials from "./ActiveOfficials.jsx";
import InactiveOfficials from "./InactiveOfficials.jsx";
import CreateOfficial from "./CreateOfficial.jsx";
import { IconLogout } from "../../components/icons.jsx";
import "../../styles/global.css";

function AdminDashboard() {
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
            <small>Admin register</small>
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

      <nav className="ns-nav">
        <NavLink to="/admin/active_officials" className={({ isActive }) => isActive ? "active" : ""}>Active officials</NavLink>
        <NavLink to="/admin/inactive_officials" className={({ isActive }) => isActive ? "active" : ""}>Inactive officials</NavLink>
        <NavLink to="/admin/create_official" className={({ isActive }) => isActive ? "active" : ""}>Create official</NavLink>
      </nav>

      <main className="ns-main">
        <Routes>
          <Route index element={<ActiveOfficials />} />
          <Route path="active_officials" element={<ActiveOfficials />} />
          <Route path="inactive_officials" element={<InactiveOfficials />} />
          <Route path="create_official" element={<CreateOfficial />} />
        </Routes>
      </main>
    </div>
  );
}

export default AdminDashboard;
