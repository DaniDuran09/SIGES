import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyDQpBiAqa_zyGxI7P0z3_u-2Gms_B0LzaM",
    authDomain: "siges-37896.firebaseapp.com",
    projectId: "siges-37896",
    storageBucket: "siges-37896.firebasestorage.app",
    messagingSenderId: "769417057274",
    appId: "1:769417057274:web:a2e681e932343748ef0a43",
};

const app = initializeApp(firebaseConfig);

const messaging = getMessaging(app);

export { messaging };