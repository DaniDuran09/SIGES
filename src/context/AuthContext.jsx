import { createContext, useContext, useState } from "react";
import { CiLight } from "react-icons/ci";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(() => localStorage.getItem("accessToken"));
    const [role, setRole] = useState(() => localStorage.getItem("role"));

    const login = (data) => {
        console.log(data);
        if (data.accessToken) {
            localStorage.setItem("accessToken", data.accessToken);
            setAccessToken(data.accessToken);
        }
        if (data.role) {
            localStorage.setItem("role", data.role);
            setRole(data.role);
        }
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("role");
        setAccessToken(null);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ role, accessToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
