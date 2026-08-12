import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { loginUserFunct } from "../../api/auth.api";

import { useAuth } from "../../context/AuthContext.jsx";
import "../../styles/global.css";

function LoginPage() {

  const { login } = useAuth();

  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    userName: "", password: ""
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
      const res = await loginUserFunct(userData);
      if (res.success) {
        alert("Login successful!");
        console.log(">>>>", res.user);

        login(res.user, res.accessToken);

        // Redirect according to role
        if (res.user.role === "CITIZEN") {
          navigate("/citizen");
        }
        else if (res.user.role === "DEPARTMENT_OFFICIAL") {
          navigate("/official");
        }
        else if (res.user.role === "SUPER_ADMIN") {
          navigate("/admin");
        }
      }
    }
    catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Login failed";
      alert(errorMessage);
    }
    setUserData({
      userName: "", password: ""
    });
  }

  return (
    <div className="ns-auth-shell">
      <div className="ns-auth-card">
        <h1>Sign in</h1>
        <p className="ns-auth-sub">Enter your registered username to continue.</p>

        <form className="ns-form" onSubmit={handleSubmit}>
          <div className="field">
            <label className="field-label" htmlFor="userName">Username</label>
            <input
              id="userName"
              type="text"
              name="userName"
              value={userData.userName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block">Sign in</button>
        </form>

        <p className="ns-auth-switch">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
export default LoginPage;
