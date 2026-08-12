import {Routes, Route} from "react-router-dom";

import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

import CitizenHome from "./pages/Citizen/CitizenHome.jsx";
import OfficialDashboard from "./pages/Official/OfficialDashboard.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";

function App(){
    return (<>
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<RegisterPage/>} />
            <Route path="/login" element={<LoginPage/>} />

            <Route path="/citizen/*"
                element={
                    <ProtectedRoute allowedRoles={["CITIZEN"]}>
                        <CitizenHome />
                    </ProtectedRoute>
                }
            />

            <Route path="/official/*"
                element={
                    <ProtectedRoute allowedRoles={["DEPARTMENT_OFFICIAL"]}>
                        <OfficialDashboard />
                    </ProtectedRoute>
                }
            />

            <Route path="/admin/*"
                element={
                    <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />
        </Routes> 
    </>);
}
export default App;