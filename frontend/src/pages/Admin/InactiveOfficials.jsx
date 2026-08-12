import { useState, useEffect } from "react";
import { getOfficialsApi, deleteOfficialApi } from "../../api/admin.api";
import EditOfficial from "./EditOfficial";
import StatusStamp from "../../components/StatusStamp.jsx";
import { IconTrash } from "../../components/icons.jsx";

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

  if (loading) return <div className="ns-state"><div className="ns-spinner" />Loading inactive officials…</div>;
  if (error) return <div className="ns-state ns-state-error">{error}</div>;

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
      <div className="ns-page-head">
        <div>
          <p className="ns-page-eyebrow">Registry</p>
          <h2>Inactive officials</h2>
        </div>
      </div>

      {officials.length === 0 ? (
        <p className="ns-empty">No inactive officials found.</p>
      ) : (
        <div className="ns-card-list">
          {officials.map((official) => (
            <article key={official._id} className="ns-card">
              <div className="ns-record-head">
                <div>
                  <div className="ns-record-title">{official.fullName}</div>
                  <span className="ns-muted ns-mono" style={{ fontSize: "0.8rem" }}>@{official.username}</span>
                </div>
                <StatusStamp status="inactive" />
              </div>
              <div className="ns-record-meta">
                <p><b>Mobile:</b> {official.mobile}</p>
                <p><b>Email:</b> {official.email}</p>
                <p><b>Department:</b> {official.departmentCode || "N/A"}</p>
              </div>
              <div className="ns-record-actions">
                <button className="btn btn-outline btn-sm" onClick={() => handleEditClick(official)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(official._id, official.username)}>
                  <IconTrash width={14} height={14} /> Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default InactiveOfficials;
