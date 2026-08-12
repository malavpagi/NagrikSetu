import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

import ActiveOfficials from "./ActiveOfficials.jsx";
import InactiveOfficials from "./InactiveOfficials.jsx";
import CreateOfficial from "./CreateOfficial.jsx";
import BrandMark from "../../components/BrandMark.jsx";

const NAV_ITEMS = [
  { to: "/admin/active_officials", label: "Active officials" },
  { to: "/admin/inactive_officials", label: "Inactive officials" },
  { to: "/admin/create_official", label: "Create official" },
];

function AdminDashboard() {
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
        style={{ background: "var(--teal-dark)", color: "#fdfdfb" }}
      >
        <div className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/10">
            <BrandMark size={18} />
          </span>
          <div>
            <p className="font-display font-bold text-[0.95rem] leading-tight">Admin Dashboard</p>
            <p className="text-[0.72rem] opacity-75 leading-tight font-mono">
              {user?.fullName || user?.username}
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
