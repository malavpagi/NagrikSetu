import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { loginUserFunct } from "../../api/auth.api";

import { useAuth } from "../../context/AuthContext.jsx";
import BrandMark from "../../components/BrandMark.jsx";

function LoginPage() {
  const { login } = useAuth();

  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    userName: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
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
        } else if (res.user.role === "DEPARTMENT_OFFICIAL") {
          navigate("/official");
        } else if (res.user.role === "SUPER_ADMIN") {
          navigate("/admin");
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Login failed";
      alert(errorMessage);
    }
    setSubmitting(false);
    setUserData({
      userName: "",
      password: "",
    });
  }

  return (
    <div className="min-h-screen flex font-body" style={{ background: "var(--paper)" }}>
      {/* Brand panel — desktop only */}
      <div
        className="hidden lg:flex flex-col justify-between w-[42%] p-12"
        style={{ background: "var(--teal)", color: "#fdfdfb" }}
      >
        <Link to="/" className="flex items-center gap-2">
          <BrandMark size={26} />
          <span className="font-display font-bold text-lg">Nagrik-Setu</span>
        </Link>
        <div>
          <p className="font-display text-3xl leading-snug max-w-sm">
            "Reported it Monday, streetlight was fixed by Thursday — with photos to prove it."
          </p>
          <p className="mt-4 text-sm opacity-75 font-mono">— a resident, Ward 12</p>
        </div>
        <p className="text-xs opacity-60 font-mono">Nagrik-Setu · citizen–government reporting bridge</p>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <span className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "var(--teal)" }}>
              <BrandMark size={18} />
            </span>
            <span className="font-display font-bold text-lg">Nagrik-Setu</span>
          </div>

          <h1 className="font-display font-bold text-2xl">Welcome back</h1>
          <p className="text-sm mt-1 mb-8" style={{ color: "var(--ink-soft)" }}>
            Log in to report issues or track your complaints.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="ns-field" htmlFor="userName">Username</label>
              <input
                id="userName"
                className="ns-input"
                type="text"
                name="userName"
                value={userData.userName}
                onChange={handleChange}
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label className="ns-field" htmlFor="password">Password</label>
              <input
                id="password"
                className="ns-input"
                type="password"
                name="password"
                value={userData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </div>

            <button type="submit" disabled={submitting} className="ns-btn ns-btn-primary mt-2 w-full">
              {submitting ? "Logging in…" : "Log in"}
            </button>
          </form>

          <p className="text-sm text-center mt-6" style={{ color: "var(--ink-soft)" }}>
            New here?{" "}
            <Link to="/register" className="font-semibold" style={{ color: "var(--teal)" }}>
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
export default LoginPage;
