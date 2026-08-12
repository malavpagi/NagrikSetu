import { useState, useEffect } from "react";
import { getOfficialsApi, deleteOfficialApi } from "../../api/admin.api";
import EditOfficial from "./EditOfficial";
import OfficialCard from "../../components/OfficialCard.jsx";

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

  const handleEditClick = (official) => setEditingOfficial(official);
  const handleCancelEdit = () => setEditingOfficial(null);
  const handleSaveEdit = () => {
    setEditingOfficial(null);
    fetchInactiveOfficials();
  };

  if (loading)
    return (
      <div className="flex justify-center py-16">
        <div className="ns-spinner" />
      </div>
    );
  if (error) return <div className="ns-card p-5" style={{ color: "var(--brick)" }}>{error}</div>;

  if (editingOfficial) {
    return <EditOfficial official={editingOfficial} onSave={handleSaveEdit} onCancel={handleCancelEdit} />;
  }

  return (
    <section>
      <h2 className="font-display font-bold text-xl mb-1" style={{ color: "var(--ink)" }}>
        Inactive officials
      </h2>
      <p className="text-sm mb-6" style={{ color: "var(--ink-soft)" }}>
        Accounts disabled from logging in. Edit to reactivate, or delete permanently.
      </p>

      {officials.length === 0 ? (
        <div className="ns-card text-center py-14 px-6">
          <p className="font-semibold" style={{ color: "var(--ink)" }}>No inactive officials found</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {officials.map((official) => (
            <OfficialCard
              key={official._id}
              official={official}
              onEdit={() => handleEditClick(official)}
              onDelete={() => handleDelete(official._id, official.username)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default InactiveOfficials;
