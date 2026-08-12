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
    <section>
      <div className="ns-page-head">
        <div>
          <p className="ns-page-eyebrow">Registry entry</p>
          <h2>Edit official</h2>
        </div>
      </div>

      <div className="ns-card" style={{ maxWidth: 520 }}>
        <form className="ns-form" onSubmit={handleSubmit}>
          <div className="field">
            <label className="field-label" htmlFor="edit-username">Username</label>
            <input id="edit-username" type="text" name="username" value={formData.username} onChange={handleChange} required />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="edit-fullName">Full name</label>
            <input id="edit-fullName" type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="edit-mobile">Mobile</label>
            <input id="edit-mobile" type="text" name="mobile" value={formData.mobile} onChange={handleChange} required />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="edit-email">Email</label>
            <input id="edit-email" type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="edit-departmentCode">Department</label>
            <select id="edit-departmentCode" name="departmentCode" value={formData.departmentCode} onChange={handleChange} required>
              <option value="">Select a department</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept.code}>
                  {dept.name} ({dept.code})
                </option>
              ))}
            </select>
          </div>

          <label className="field field-checkbox">
            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
            <span className="field-label" style={{ marginBottom: 0 }}>Account active</span>
          </label>

          <div className="ns-flex-actions">
            <button type="submit" className="btn btn-primary">Save changes</button>
            <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default EditOfficial;
