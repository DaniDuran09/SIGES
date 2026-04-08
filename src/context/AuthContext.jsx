import { createContext, useContext, useState } from "react";
import { apiFetch } from "../api/client";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(() => localStorage.getItem("accessToken"));
    const [role, setRole] = useState(() => localStorage.getItem("role"));

    const login = async (data) => {
        console.log(data);
        if (data.accessToken) {
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
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

    const logout = async () => {
        const refreshToken = localStorage.getItem("refreshToken");
        const fcmToken = localStorage.getItem("fcmToken");

        try {
            // Unregister FCM Token
            if (fcmToken) {
                await apiFetch(`/users/me/push-tokens/${fcmToken}`, {
                    method: 'DELETE'
                });
            }

            // Server logout
            if (refreshToken) {
                await apiFetch('/auth/logout', {
                    method: 'POST',
                    body: JSON.stringify({ refreshToken })
                });
            }
        } catch (error) {
            console.error("Error during logout process:", error);
        } finally {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("fcmToken");
            localStorage.removeItem("role");
            setAccessToken(null);
            setRole(null);
        }
    };

    return (
        <AuthContext.Provider value={{ role, accessToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
