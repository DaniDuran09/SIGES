import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { messaging } from "../firebase";
import { getToken, onMessage } from "firebase/messaging";
import { apiFetch } from "../api/client";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { accessToken } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const getFCMToken = useCallback(async () => {
        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                if ('serviceWorker' in navigator) {
                    const params = new URLSearchParams({
                        apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
                        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
                        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
                        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
                        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
                        appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
                    });
                    const swUrl = `/firebase-messaging-sw.js?${params.toString()}`;
                    const registration = await navigator.serviceWorker.register(swUrl);

                    const token = await getToken(messaging, {
                        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
                        serviceWorkerRegistration: registration
                    });
                    if (token) {
                        localStorage.setItem("fcmToken", token);
                    }
                    return token;
                }
            }
        } catch (error) {
            console.error("Error getting FCM token:", error);
        }
        return null;
    }, []);

    const fetchNotifications = useCallback(async (pageNum = 0) => {
        if (!accessToken) return;

        setLoading(true);
        try {
            const response = await apiFetch(`/notifications?page=${pageNum}&size=10&sort=sentAt,desc`);
            if (response && response.content) {
                if (pageNum === 0) {
                    setNotifications(response.content);
                } else {
                    setNotifications(prev => [...prev, ...response.content]);
                }
                setHasMore(!response.last);

                if (pageNum === 0) {
                    const unread = response.content.filter(n => n.readStatus === 'UNREAD').length;
                    setUnreadCount(unread);
                }
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    }, [accessToken]);

    const fetchNextPage = useCallback(() => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchNotifications(nextPage);
        }
    }, [loading, hasMore, page, fetchNotifications]);

    const registerTokenOnServer = useCallback(async () => {
        if (!accessToken) return;

        try {
            const token = await getFCMToken();
            if (token) {
                await apiFetch('/users/me/push-tokens', {
                    method: 'POST',
                    body: JSON.stringify({
                        token,
                        platform: 'WEB',
                        deviceId: navigator.userAgent
                    })
                });
                console.log("FCM Token registered successfully");
            }
        } catch (error) {
            console.error("Error during automatic token registration:", error);
        }
    }, [accessToken, getFCMToken]);

    useEffect(() => {
        if (accessToken) {
            fetchNotifications(0);
            registerTokenOnServer();
        } else {
            setNotifications([]);
            setUnreadCount(0);
            setPage(0);
            setHasMore(true);
        }
    }, [accessToken, fetchNotifications, registerTokenOnServer]);

    useEffect(() => {
        const unsubscribe = onMessage(messaging, (payload) => {
            console.log("Foreground message received:", payload);
            const { notification, data } = payload;

            const newNotification = {
                id: data.id,
                title: notification.title,
                message: notification.body,
                sentAt: new Date().toISOString(),
                readStatus: 'UNREAD',
                metadata: data
            };

            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
        });

        return () => unsubscribe();
    }, []);

    const markAsRead = async (id) => {
        try {
            await apiFetch(`/notifications/${id}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ status: 'READ' })
            });
            setNotifications(prev => prev.map(n =>
                n.id === id ? { ...n, readStatus: 'READ' } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await apiFetch('/notifications/status', {
                method: 'PATCH',
                body: JSON.stringify({ status: 'READ' })
            });
            setNotifications(prev => prev.map(n => ({ ...n, readStatus: 'READ' })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
        }
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            getFCMToken,
            markAsRead,
            markAllAsRead,
            fetchNotifications: () => fetchNotifications(0),
            fetchNextPage,
            hasMore,
            loading
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotifications must be used within a NotificationProvider");
    }
    return context;
};
