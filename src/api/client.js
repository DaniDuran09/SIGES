import { getGenericErrorMessage, translateError } from "./errorCodes";

const API_URL = import.meta.env.VITE_API_URL;
let isRefreshing = false;

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

    const performRequest = async (token) => {
        return await fetch(url, {
            ...fetchOptions,
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers,
            },
        });
    };

    let response = await performRequest(accessToken);

    // Si recibimos 403, intentamos refrescar el token
    if (response.status === 403 && !isRefreshing && !endpoint.includes("/auth/refresh")) {
        isRefreshing = true;
        const refreshToken = localStorage.getItem("refreshToken");

        if (refreshToken) {
            try {
                const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ refreshToken }),
                });

                if (refreshResponse.ok) {
                    const data = await refreshResponse.json();
                    localStorage.setItem("accessToken", data.accessToken);
                    isRefreshing = false;
                    // Reintentamos la petición original con el nuevo token
                    response = await performRequest(data.accessToken);
                } else {
                    throw new Error("Refresh failed");
                }
            } catch (error) {
                isRefreshing = false;
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("role");
                window.location.href = "/login";
                return;
            }
        } else {
            isRefreshing = false;
            window.location.href = "/login";
            return;
        }
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let rawMessage = "";

        if (errorData.errors && Array.isArray(errorData.errors)) {
            rawMessage = errorData.errors.join(". ");
        } 
        else if (errorData.detail || errorData.message) {
            rawMessage = errorData.detail || errorData.message;
        } 
        else {
            rawMessage = getGenericErrorMessage(response.status);
        }

        const message = translateError(rawMessage);
        const error = new Error(message);
        error.status = response.status;
        error.data = errorData;
        throw error;
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
};

