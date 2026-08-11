import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { registerUserFunct } from "../../api/auth.api";

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
        }catch (err) {
            const errorMessage =
            err.response?.data?.message || err.message || "Registration failed";
            alert(errorMessage);
        }
        setUserData({
          userName: "", fullName: "", mobileNo: "", email: "", password: ""
        });       
    }

    return (
        <div>
          <h1>Fill the form</h1>
          <br />
          <form onSubmit={handleSubmit}>
            <label>
              Enter Full Name:{" "}
              <input type="text" name="fullName" value={userData.fullName} onChange={handleChange} required />
            </label>
            <br /> <br />

            <label>
              Enter Username:{" "}
              <input type="text" name="userName" value={userData.userName} onChange={handleChange} required />
            </label>
            <br /> <br />

            <label>
              Enter Mobile No:{" "}
              <input type="text" name="mobileNo" value={userData.mobileNo} onChange={handleChange} required />
            </label>
            <br /> <br />

            <label>
              Enter Email:{" "}
              <input type="email" name="email" value={userData.email} onChange={handleChange} required />
            </label>
            <br /><br />

            <label>
              Enter Password:{" "}
              <input type="password" name="password" value={userData.password} onChange={handleChange} required />
            </label>
            <br /><br />

            <button type="submit">Create Account</button>
          </form>
        </div>
    );
}

export default RegisterPage;