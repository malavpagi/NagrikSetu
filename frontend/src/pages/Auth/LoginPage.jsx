import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUserFunct } from "../../api/auth.api";

import { useAuth } from "../../context/AuthContext.jsx";


function LoginPage(){
    
    const { login } = useAuth();

    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        userName : "", password : ""
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
        
        try{
            const res = await loginUserFunct(userData);
            if (res.success) {
                alert("Login successful!");
                console.log(res.user);

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
        catch(err){
            const errorMessage = err.response?.data?.message || err.message || "Login failed";
            alert(errorMessage);
        }
        setUserData({
          userName: "",password: ""
        }); 
    }

    return (<>
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Enter Username:{" "}
                    <input type="text" name="userName" value={userData.userName} onChange={handleChange} required />
                </label>
                <br /> <br />

                <label>
                    Enter Password:{" "}
                    <input type="password" name="password" value={userData.password} onChange={handleChange} required />
                </label>
                <br /><br />

                <button type="submit">Login</button>
            </form>
        </div>
    </>);
}
export default LoginPage;