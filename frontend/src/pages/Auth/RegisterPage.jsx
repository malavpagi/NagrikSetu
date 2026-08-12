import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { registerUserFunct } from "../../api/auth.api";
import BrandMark from "../../components/BrandMark.jsx";

function RegisterPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    userName: "",
    fullName: "",
    mobileNo: "",
    email: "",
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
      const res = await registerUserFunct(userData);

      if (res.success) {
        console.log(res.user);
        alert("Registration successful!");
        navigate("/login");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Registration failed";
      alert(errorMessage);
    }
    setSubmitting(false);
    setUserData({
      userName: "",
      fullName: "",
      mobileNo: "",
      email: "",
      password: "",
    });
  }

  return (
    <div className="min-h-screen flex font-body" style={{ background: "var(--paper)" }}>
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
            Every account is a direct line to the department that can fix the problem.
          </p>
        </div>
        <p className="text-xs opacity-60 font-mono">Nagrik-Setu · citizen–government reporting bridge</p>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <span className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "var(--teal)" }}>
              <BrandMark size={18} />
            </span>
            <span className="font-display font-bold text-lg">Nagrik-Setu</span>
          </div>

          <h1 className="font-display font-bold text-2xl">Create your account</h1>
          <p className="text-sm mt-1 mb-8" style={{ color: "var(--ink-soft)" }}>
            Takes under a minute. You'll need it to submit complaints.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="ns-field" htmlFor="fullName">Full name</label>
              <input id="fullName" className="ns-input" type="text" name="fullName" value={userData.fullName} onChange={handleChange} required />
            </div>

            <div>
              <label className="ns-field" htmlFor="userName">Username</label>
              <input id="userName" className="ns-input" type="text" name="userName" value={userData.userName} onChange={handleChange} required />
            </div>

            <div>
              <label className="ns-field" htmlFor="mobileNo">Mobile number</label>
              <input id="mobileNo" className="ns-input" type="text" name="mobileNo" value={userData.mobileNo} onChange={handleChange} required />
            </div>

            <div>
              <label className="ns-field" htmlFor="email">Email</label>
              <input id="email" className="ns-input" type="email" name="email" value={userData.email} onChange={handleChange} required />
            </div>

            <div>
              <label className="ns-field" htmlFor="password">Password</label>
              <input id="password" className="ns-input" type="password" name="password" value={userData.password} onChange={handleChange} required autoComplete="new-password" />
            </div>

            <button type="submit" disabled={submitting} className="ns-btn ns-btn-primary mt-2 w-full">
              {submitting ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="text-sm text-center mt-6" style={{ color: "var(--ink-soft)" }}>
            Already registered?{" "}
            <Link to="/login" className="font-semibold" style={{ color: "var(--teal)" }}>
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
