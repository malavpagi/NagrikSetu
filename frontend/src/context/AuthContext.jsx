import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(
        localStorage.getItem("accessToken")
    );


    const login = (userData, token) => {
        setUser(userData);
        setAccessToken(token);
        localStorage.setItem("accessToken", token);
    };


    const logout = () => {
        setUser(null);
        setAccessToken(null);
        localStorage.removeItem("accessToken");
    };


    return (
        <AuthContext.Provider value={{user,accessToken,login,logout}}>
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth() {
    return useContext(AuthContext);
}