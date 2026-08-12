import { useState, useEffect } from "react";
import { updateOfficialApi, getDepartmentsApi } from "../../api/admin.api";

function EditOfficial({ official, onSave, onCancel }) {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    username: official.username || "",
    fullName: official.fullName || "",
    mobile: official.mobile || "",
    email: official.email || "",
    departmentCode: official.departmentCode || "",
    isActive: official.isActive ?? true,
  });

  useEffect(() => {
    async function loadDepartments() {
      try {
        const res = await getDepartmentsApi();
        setDepartments(res.data || res);
      } catch (err) {
        console.error("Failed to load departments:", err);
      }
    }
    loadDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateOfficialApi(official._id, formData);
      alert("Official updated successfully!");
      onSave();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update official.");
    }
  };

  return (
    <section className="max-w-xl">
      <h2 className="font-display font-bold text-xl mb-1" style={{ color: "var(--ink)" }}>
        Edit official
      </h2>
      <p className="text-sm mb-6" style={{ color: "var(--ink-soft)" }}>
        Update account details or toggle access.
      </p>

      <form onSubmit={handleSubmit} className="ns-card p-5 sm:p-6 flex flex-col gap-4">
        <div>
          <label className="ns-field" htmlFor="edit-username">Username</label>
          <input id="edit-username" className="ns-input" type="text" name="username" value={formData.username} onChange={handleChange} required />
        </div>

        <div>
          <label className="ns-field" htmlFor="edit-fullName">Full name</label>
          <input id="edit-fullName" className="ns-input" type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="ns-field" htmlFor="edit-mobile">Mobile</label>
            <input id="edit-mobile" className="ns-input" type="text" name="mobile" value={formData.mobile} onChange={handleChange} required />
          </div>
          <div>
            <label className="ns-field" htmlFor="edit-email">Email</label>
            <input id="edit-email" className="ns-input" type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
        </div>

        <div>
          <label className="ns-field" htmlFor="edit-departmentCode">Department</label>
          <select id="edit-departmentCode" className="ns-input" name="departmentCode" value={formData.departmentCode} onChange={handleChange} required>
            <option value="">-- Select department --</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept.code}>
                {dept.name} ({dept.code})
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2.5 text-sm font-medium select-none" style={{ color: "var(--ink)" }}>
          <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-4 h-4" />
          Active account
        </label>

        <div className="flex gap-3 mt-1">
          <button type="submit" className="ns-btn ns-btn-primary flex-1">Save changes</button>
          <button type="button" onClick={onCancel} className="ns-btn ns-btn-ghost">Cancel</button>
        </div>
      </form>
    </section>
  );
}

export default EditOfficial;
