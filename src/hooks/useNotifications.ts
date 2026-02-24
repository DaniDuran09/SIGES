import { messaging } from "../firebase";
import { getToken } from "firebase/messaging";

const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

export const useNotifications = () => {
    const requestPermission = async () => {
        try {
            const permission = await Notification.requestPermission();

            if (permission !== "granted") {
                console.log("Permiso denegado");
                return;
            }

            // Register service worker with config as query params
            const config = {
                apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
                authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
                projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
                storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
                messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
                appId: import.meta.env.VITE_FIREBASE_APP_ID,
            };
            const queryString = new URLSearchParams(config).toString();
            await navigator.serviceWorker.register(`/firebase-messaging-sw.js?${queryString}`);

            const token = await getToken(messaging, { vapidKey });

            if (token) {
                console.log("TOKEN FCM:");
                console.log(token);
            } else {
                console.log("No se generó token");
            }

        } catch (error) {
            console.log("Error notificaciones:", error);
        }
    };
    return { requestPermission };
};