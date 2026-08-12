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
    <section className="max-w-xl">
      <h2 className="font-display font-bold text-xl mb-1" style={{ color: "var(--ink)" }}>
        Create new official
      </h2>
      <p className="text-sm mb-6" style={{ color: "var(--ink-soft)" }}>
        They'll be able to log in and process complaints for their department.
      </p>

      <form onSubmit={handleSubmit} className="ns-card p-5 sm:p-6 flex flex-col gap-4">
        <div>
          <label className="ns-field" htmlFor="username">Username</label>
          <input id="username" className="ns-input" type="text" name="username" value={formData.username} onChange={handleChange} required />
        </div>

        <div>
          <label className="ns-field" htmlFor="fullName">Full name</label>
          <input id="fullName" className="ns-input" type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="ns-field" htmlFor="mobile">Mobile</label>
            <input id="mobile" className="ns-input" type="text" name="mobile" value={formData.mobile} onChange={handleChange} required />
          </div>
          <div>
            <label className="ns-field" htmlFor="email">Email</label>
            <input id="email" className="ns-input" type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
        </div>

        <div>
          <label className="ns-field" htmlFor="password">Password</label>
          <input id="password" className="ns-input" type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>

        <div>
          <label className="ns-field" htmlFor="departmentCode">Department</label>
          <select id="departmentCode" className="ns-input" name="departmentCode" value={formData.departmentCode} onChange={handleChange} required>
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
          <button type="submit" disabled={loading} className="ns-btn ns-btn-primary flex-1">
            {loading ? "Creating…" : "Create official"}
          </button>
          <button type="button" onClick={handleCancel} className="ns-btn ns-btn-ghost">
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}

export default CreateOfficial;
