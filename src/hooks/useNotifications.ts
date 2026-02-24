import { messaging } from "../firebase";
import { getToken } from "firebase/messaging";

const vapidKey = "BKWuTPyVpfOO9XqJTWhDwk8rHpDxgOkhZ4SnyDReIXNjxylIsX6EHYP8bwcRvyfcjKSCs2r_go6Tx1crAVlXm4Y";

export const useNotifications = () => {
    const requestPermission = async () => {
        try {
            const permission = await Notification.requestPermission();

            if (permission !== "granted") {
                console.log("Permiso denegado");
                return;
            }

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