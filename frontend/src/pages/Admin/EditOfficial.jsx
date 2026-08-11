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
      <h2>Edit Official</h2>
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
          <button type="submit">Save</button>{" "}
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}

export default EditOfficial;