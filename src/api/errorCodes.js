export const HTTP_ERROR_MESSAGES = {
    400: "Los datos ingresados son incorrectos. Por favor, verifica la información.",
    401: "El correo o la contraseña son incorrectos.",
    403: "Acceso denegado. No tienes permisos para realizar esta acción.",
    404: "El recurso solicitado no fue encontrado.",
    405: "Método no permitido.",
    409: "Conflicto. Es posible que el registro ya exista.",
    422: "Error de validación. Revisa los campos marcados.",
    429: "Demasiados intentos. Por favor, espera un momento.",
    500: "Error interno del servidor. Inténtalo de nuevo más tarde.",
    502: "Puerta de enlace incorrecta.",
    503: "Servicio no disponible.",
    504: "Tiempo de espera agotado."
};

export const getGenericErrorMessage = (status) => {
    if (status >= 500) return HTTP_ERROR_MESSAGES[500];
    if (status >= 400) return HTTP_ERROR_MESSAGES[status] || HTTP_ERROR_MESSAGES[400];
    return "Ha ocurrido un error inesperado.";
};

const ERROR_TRANSLATIONS = {
    "Email must have 'utez.edu.mx' domain": "El correo debe tener el dominio '@utez.edu.mx'",
    "must be a well-formed email address": "debe ser un correo electrónico válido",
    "must match": "debe coincidir con el formato requerido",

    "already in use": "ya está en uso por otro registro",
    "already exists": "ya existe en el sistema",
    "not found": "no encontrado",

    "size must be between": "el tamaño debe estar entre",
    "must not be null": "es obligatorio",
    "must not be blank": "no puede estar vacío",
    "must be in the past": "debe ser una fecha pasada",
    "must be in the future": "debe ser una fecha futura",

    "email:": "Correo:",
    "password:": "Contraseña:",
    "phoneNumber:": "Teléfono:",
    "firstName:": "Nombre:",
    "lastName:": "Apellido:",
    "birthDate:": "Fecha de nacimiento:",
    "registrationNumber:": "Matrícula:",
    "employeeNumber:": "Número de empleado:"
};

export const translateError = (message) => {
    if (!message) return message;

    let translated = message;

    Object.entries(ERROR_TRANSLATIONS).forEach(([original, translation]) => {
        const regex = new RegExp(original, "gi");
        translated = translated.replace(regex, translation);
    });

    return translated;
};
