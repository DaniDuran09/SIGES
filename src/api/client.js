const API_URL = import.meta.env.VITE_API_URL;

export const apiFetch = async (endpoint, options = {}) => {
    const accessToken = localStorage.getItem("accessToken");
    const { params, ...fetchOptions } = options;

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
        ...fetchOptions,
        headers: {
            "Content-Type": "application/json",
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
            ...options.headers,
        },
    });

    if (response.status === 401 || response.status === 403) {
        throw new Error("ERROR");
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.message || response.statusText || "Error en la petición");
        error.status = response.status;
        error.data = errorData;
        throw error;
    }

    return response.json();
};