const API_URL = import.meta.env.VITE_API_URL;

export const apiFetch = async (endpoint, options = {}) => {
    const accessToken = localStorage.getItem("accessToken");

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
            ...options.headers,
        }
    });

    if (response.status === 401 || response.status === 403) {
        throw new Error("ERROR");
    }

    if (!response.ok) {
        throw new Error("Error en la petición");
    }

    return response.json();
};