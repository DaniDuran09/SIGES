import { createContext, useContext, useState } from "react";

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
        if (data.role !== "ADMIN") {
            throw new Error("No tienes permisos para iniciar sesión");
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
