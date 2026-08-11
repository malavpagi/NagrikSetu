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
      <h2>Create New Official</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Username:{" "}
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <br />

        <div>
          <label>
            Full Name:{" "}
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <br />

        <div>
          <label>
            Mobile:{" "}
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <br />

        <div>
          <label>
            Email:{" "}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <br />

        <div>
          <label>
            Password:{" "}
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <br />

        <div>
          <label>
            Department:{" "}
            <select
              name="departmentCode"
              value={formData.departmentCode}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Department --</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept.code}>
                  {dept.name} ({dept.code})
                </option>
              ))}
            </select>
          </label>
        </div>
        <br />

        <div>
          <label>
            Active Account:{" "}
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
          </label>
        </div>
        <br />

        <div>
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </button>{" "}
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}

export default CreateOfficial;