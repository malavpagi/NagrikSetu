import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

import IncomingComplaints from "./IncomingComplaints.jsx";
import ProcessingComplaints from "./ProcessingComplaints.jsx";
import ProcessedComplaints from "./ProcessedComplaints.jsx";
import HeatMap from "./HeatMap.jsx";

function OfficialDashboard() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <header>
        <h1>Department Official Dashboard</h1>
        <p>
          Logged in as: <strong>{user?.fullName || user?.username}</strong> ({user?.departmentCode || "Official"})
        </p>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <hr />

      <nav>
        <ul>
          <li>
            <Link to="/official/incoming">Incoming Complaints</Link>
          </li>
          <li>
            <Link to="/official/processing">Processing Complaints</Link>
          </li>
          <li>
            <Link to="/official/processed">Processed Complaints</Link>
          </li>
          <li>
            <Link to="/official/heatmap">Show HeatMap</Link>
          </li>
        </ul>
      </nav>

      <hr />

      <main>
        <Routes>
          <Route index element={<IncomingComplaints />} />
          <Route path="incoming" element={<IncomingComplaints />} />
          <Route path="processing" element={<ProcessingComplaints />} />
          <Route path="processed" element={<ProcessedComplaints />} />
          <Route path="heatmap" element={<HeatMap />} />
        </Routes>
      </main>
    </>
  );
}

export default OfficialDashboard;