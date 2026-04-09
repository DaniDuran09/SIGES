import { getGenericErrorMessage, translateError } from "./errorCodes";

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

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let rawMessage = "";

        // 1. Prioridad: Errores de validación explícitos del backend
        if (errorData.errors && Array.isArray(errorData.errors)) {
            rawMessage = errorData.errors.join(". ");
        } 
        // 2. Segunda prioridad: Mensajes específicos del backend
        else if (errorData.detail || errorData.message) {
            rawMessage = errorData.detail || errorData.message;
        } 
        // 3. Tercera prioridad: Mensaje semántico basado en el código HTTP
        else {
            rawMessage = getGenericErrorMessage(response.status);
        }

        // Traducir el mensaje antes de lanzarlo
        const message = translateError(rawMessage);

        const error = new Error(message);
        error.status = response.status;
        error.data = errorData;
        throw error;
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
};
