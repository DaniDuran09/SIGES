export const triggerLogout = () => {
    window.dispatchEvent(new Event("auth:logout"));
};