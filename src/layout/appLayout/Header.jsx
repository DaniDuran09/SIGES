import { useState, useRef, useEffect, useCallback } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { IoMdNotificationsOutline } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        fetchNextPage,
        hasMore,
        loading
    } = useNotifications();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const observer = useRef();
    const navigate = useNavigate();

    const lastNotificationElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                fetchNextPage();
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore, fetchNextPage]);

    const handleNotificationClick = (notification) => {
        markAsRead(notification.id);
        setShowDropdown(false);
        const reservationId = notification.metadata?.reservationId || notification.reservation?.id;
        if (reservationId) {
            navigate(`/requests/${reservationId}`);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className={styles.header}>
            <div className={styles.flexFiller} />

            <div className={styles.actions} ref={dropdownRef}>
                <div className={styles.notificationWrapper}>
                    <button
                        className={styles.notificationButton}
                        onClick={() => setShowDropdown(!showDropdown)}
                        aria-label="Notificaciones"
                    >
                        <IoMdNotificationsOutline size={28} />
                        {unreadCount > 0 && (
                            <span className={styles.badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>
                        )}
                    </button>

                    {showDropdown && (
                        <div className={styles.dropdown}>
                            <div className={styles.dropdownHeader}>
                                <h3>Notificaciones</h3>
                                {unreadCount > 0 && (
                                    <button
                                        className={styles.markAllBtn}
                                        onClick={markAllAsRead}
                                    >
                                        Marcar todas como leídas
                                    </button>
                                )}
                            </div>
                            <div className={styles.notificationList}>
                                {notifications.length === 0 && !loading ? (
                                    <div className={styles.emptyContainer}>
                                        <p className={styles.empty}>No tienes notificaciones por el momento</p>
                                    </div>
                                ) : (
                                    <>
                                        {notifications.map((n, index) => {
                                            const isLast = notifications.length === index + 1;
                                            return (
                                                <div
                                                    key={n.id || index}
                                                    ref={isLast ? lastNotificationElementRef : null}
                                                    className={`${styles.notificationItem} ${n.readStatus === 'UNREAD' ? styles.unread : ''}`}
                                                    onClick={() => handleNotificationClick(n)}
                                                >
                                                    <div className={styles.itemContent}>
                                                        <p className={styles.itemTitle}>{n.title || 'Nueva notificación'}</p>
                                                        <p className={styles.itemMessage}>{n.message}</p>
                                                        <span className={styles.itemTime}>
                                                            {new Date(n.sentAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                                        </span>
                                                    </div>
                                                    {n.readStatus === 'UNREAD' && <span className={styles.unreadDot} />}
                                                </div>
                                            );
                                        })}
                                        {loading && (
                                            <div className={styles.loadingItem}>Cargando más...</div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
