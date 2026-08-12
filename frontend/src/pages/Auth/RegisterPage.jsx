import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { registerUserFunct } from "../../api/auth.api";
import "../../styles/global.css";

function RegisterPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    userName: "",
    fullName: "",
    mobileNo: "",
    email: "", password: ""
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    console.log("Form Data:", userData);

    try {
      const res = await registerUserFunct(userData);

      if (res.success) {
        console.log(res.user);
        alert("Registration successful!");
        navigate("/login");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Registration failed";
      alert(errorMessage);
    }
    setUserData({
      userName: "", fullName: "", mobileNo: "", email: "", password: ""
    });
  }

  return (
    <div className="ns-auth-shell">
      <div className="ns-auth-card">
        <h1>Create account</h1>
        <p className="ns-auth-sub">Register to report issues in your area.</p>

        <form className="ns-form" onSubmit={handleSubmit}>
          <div className="field">
            <label className="field-label" htmlFor="fullName">Full name</label>
            <input id="fullName" type="text" name="fullName" value={userData.fullName} onChange={handleChange} required />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="userName">Username</label>
            <input id="userName" type="text" name="userName" value={userData.userName} onChange={handleChange} required />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="mobileNo">Mobile number</label>
            <input id="mobileNo" type="text" name="mobileNo" value={userData.mobileNo} onChange={handleChange} required />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="email">Email</label>
            <input id="email" type="email" name="email" value={userData.email} onChange={handleChange} required />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="password">Password</label>
            <input id="password" type="password" name="password" value={userData.password} onChange={handleChange} required />
          </div>

          <button type="submit" className="btn btn-primary btn-block">Create account</button>
        </form>

        <p className="ns-auth-switch">
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
