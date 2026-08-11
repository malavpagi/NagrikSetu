import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

import ActiveOfficials from "./ActiveOfficials.jsx";
import InactiveOfficials from "./InactiveOfficials.jsx";
import CreateOfficial from "./CreateOfficial.jsx";

function AdminDashboard() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <header>
        <h1>Admin Dashboard</h1>
        <p>Logged in as: {user?.fullName || user?.username}</p>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <hr />

      <nav>
        <ul>
          <li>
            <Link to="/admin/active_officials">Active Officials</Link>
          </li>
          <li>
            <Link to="/admin/inactive_officials">Inactive Officials</Link>
          </li>
          <li>
            <Link to="/admin/create_official">Create Official</Link>
          </li>
        </ul>
      </nav>

      <hr />

      <main>
        <Routes>
          <Route index element={<ActiveOfficials />} />
          <Route path="active_officials" element={<ActiveOfficials />} />
          <Route path="inactive_officials" element={<InactiveOfficials />} />
          <Route path="create_official" element={<CreateOfficial />} />
        </Routes>
      </main>
    </>
  );
}

export default AdminDashboard;