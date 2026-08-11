import { useState, useEffect } from "react";
import { getOfficialsApi, deleteOfficialApi } from "../../api/admin.api";
import EditOfficial from "./EditOfficial";

function ActiveOfficials() {
  const [officials, setOfficials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingOfficial, setEditingOfficial] = useState(null);

  const fetchActiveOfficials = async () => {
    try {
      setLoading(true);
      const res = await getOfficialsApi(true);
      setOfficials(res.data || res);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch active officials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveOfficials();
  }, []);

  const handleDelete = async (id, username) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete official "${username}"?`);
    if (!confirmDelete) return;

    try {
      await deleteOfficialApi(id);
      alert("Official deleted successfully.");
      setOfficials((prev) => prev.filter((official) => official._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete official.");
    }
  };

  const handleEditClick = (official) => {
    setEditingOfficial(official);
  };

  const handleCancelEdit = () => {
    setEditingOfficial(null);
  };

  const handleSaveEdit = () => {
    setEditingOfficial(null);
    fetchActiveOfficials();
  };

  if (loading) return <div>Loading active officials...</div>;
  if (error) return <div>Error: {error}</div>;

  if (editingOfficial) {
    return (
      <EditOfficial
        official={editingOfficial}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
      />
    );
  }

  return (
    <section>
      <h2>Active Officials List</h2>
      {officials.length === 0 ? (
        <p>No active officials found.</p>
      ) : (
        <div>
          {officials.map((official) => (
            <article key={official._id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
              <h3>Username: {official.username}</h3>
              <p>Full Name: {official.fullName}</p>
              <p>Mobile: {official.mobile}</p>
              <p>Email: {official.email}</p>
              <p>Department Code: {official.departmentCode || "N/A"}</p>
              <div>
                <button onClick={() => handleEditClick(official)}>Edit</button>{" "}
                <button onClick={() => handleDelete(official._id, official.username)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default ActiveOfficials;