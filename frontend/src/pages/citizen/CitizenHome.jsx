import {Routes, Route} from "react-router-dom";

import HomePage from "./HomePage";
import ProfilePage from "./ProfilePage";

function CitizenHome(){
    return (<>
        <h1>This is Citizen Dashboard</h1>
        <Routes>
            <Route index element={<HomePage />} />
            <Route path="profile" element={<ProfilePage />} />
        </Routes>
    </>);
}
export default CitizenHome;