import { useState, useEffect } from "react";
import { getOfficialsApi, deleteOfficialApi } from "../../api/admin.api";
import EditOfficial from "./EditOfficial";

function InactiveOfficials() {
  const [officials, setOfficials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingOfficial, setEditingOfficial] = useState(null);

  const fetchInactiveOfficials = async () => {
    try {
      setLoading(true);
      const res = await getOfficialsApi(false); // pass false to fetch inactive officials
      setOfficials(res.data || res);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch inactive officials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInactiveOfficials();
  }, []);

  const handleDelete = async (id, username) => {
    const confirmDelete = window.confirm(`Are you sure you want to permanently delete official "${username}"?`);
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
    fetchInactiveOfficials(); // Refresh list to reflect updates
  };

  if (loading) return <div>Loading inactive officials...</div>;
  if (error) return <div>Error: {error}</div>;

  // Render Edit View when an official is selected for editing
  if (editingOfficial) {
    return (
      <EditOfficial
        official={editingOfficial}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
      />
    );
  }

  // Render Cards List View
  return (
    <section>
      <h2>Inactive Officials List</h2>
      {officials.length === 0 ? (
        <p>No inactive officials found.</p>
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

export default InactiveOfficials;