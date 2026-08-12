import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createOfficialApi, getDepartmentsApi } from "../../api/admin.api";

function CreateOfficial() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    mobile: "",
    email: "",
    password: "",
    departmentCode: "",
    isActive: true, // Default to true, editable by Admin
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
    setLoading(true);

    try {
      const payload = {
        ...formData,
        role: "DEPARTMENT_OFFICIAL",
      };

      await createOfficialApi(payload);
      alert("Official created successfully!");

      // Navigate to active or inactive page depending on selected status
      if (formData.isActive) {
        navigate("/admin/active_officials");
      } else {
        navigate("/admin/inactive_officials");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create official.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/active_officials");
  };

  return (
    <section>
      <div className="ns-page-head">
        <div>
          <p className="ns-page-eyebrow">Registry entry</p>
          <h2>Create new official</h2>
        </div>
      </div>

      <div className="ns-card" style={{ maxWidth: 520 }}>
        <form className="ns-form" onSubmit={handleSubmit}>
          <div className="field">
            <label className="field-label" htmlFor="username">Username</label>
            <input id="username" type="text" name="username" value={formData.username} onChange={handleChange} required />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="fullName">Full name</label>
            <input id="fullName" type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="mobile">Mobile</label>
            <input id="mobile" type="text" name="mobile" value={formData.mobile} onChange={handleChange} required />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="email">Email</label>
            <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="password">Temporary password</label>
            <input id="password" type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="departmentCode">Department</label>
            <select id="departmentCode" name="departmentCode" value={formData.departmentCode} onChange={handleChange} required>
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
            <span className="field-label" style={{ marginBottom: 0 }}>Activate account immediately</span>
          </label>

          <div className="ns-flex-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Creating…" : "Create official"}
            </button>
            <button type="button" className="btn btn-outline" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default CreateOfficial;
