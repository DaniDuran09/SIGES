const API_URL = import.meta.env.VITE_API_URL;

export const apiFetch = async (endpoint, options = {}) => {
    const accessToken = localStorage.getItem("accessToken");
    const { params, ...fethcOptions } = options;

    let url = `${API_URL}${endpoint}`;
    if (params) {
        const query = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach(v => query.append(key, v));
            } else {
                query.append(key, value);
            }
        });

        url += `?${query.toString()}`;
    }

    const response = await fetch(url, {
        ...fethcOptions,
        headers: {
            "Content-Type": "application/json",
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
            ...options.headers,
        }
    });

    if (response.status === 401 || response.status === 403) {
        throw new Error("Usuario o contraseña incorrectos");
    }

    if (!response.ok) {
        throw new Error(response.message || "Error en la petición");
    }

    return response.json();
};