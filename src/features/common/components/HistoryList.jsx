import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../../api/client";
import { FiCalendar, FiMapPin, FiClipboard } from "react-icons/fi";
import LoaderCircle from "../../../assets/components/LoaderCircle";
import styles from "./HistoryList.module.css";
import React from 'react';

function HistoryList({ resourceId, resourceName, reservableType }) {
    const { data: reservationsRaw, isPending, error } = useQuery({
        queryKey: ["GetResourceReservations", resourceId],
        queryFn: () => apiFetch(`/reservations`, {
            method: "GET",
            params: { reservableId: parseInt(resourceId), size: 50 }
        }),
        retry: false
    });

    if (isPending) return <LoaderCircle />;

    if (error) {
        return (
            <div className={styles.historySection}>
                <h3 className={styles.historyTitle}>HISTORIAL INDIVIDUAL</h3>
                <div className={styles.emptyState}>
                    <div className={styles.emptyIconWrapper}><FiClipboard /></div>
                    <h3>Error al cargar el historial</h3>
                    <p style={{ color: '#ef4444' }}>{error.message}</p>
                </div>
            </div>
        );
    }

    // Format and filter the data
    const reservs = Array.isArray(reservationsRaw) ? reservationsRaw : (reservationsRaw?.content || []);

    // Show all reservations as history (no status filter)
    const filteredReservations = reservs;

    // Helper to format date
    const formatDate = (dateString) => {
        if (!dateString) return "Fecha desconocida";
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    // Helper to get initials
    const getInitials = (firstName, lastName) => {
        return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase() || 'U';
    };

    const determineBadgeInfo = (statusStr) => {
        const s = (statusStr || '').toLowerCase();
        if (s === 'approved') return { class: styles.badgeAprobada, text: 'Aprobada' };
        if (s === 'pending') return { class: styles.badgePendiente, text: 'Pendiente' };
        if (s === 'denied' || s === 'rejected') return { class: styles.badgeCancelada, text: 'Denegada' };
        if (s === 'cancelled' || s === 'canceled') return { class: styles.badgeCancelada, text: 'Cancelada' };
        if (s === 'completed' || s === 'finished') return { class: styles.badgeDevuelto, text: 'Completada' };
        if (s.includes('approv')) return { class: styles.badgeAprobada, text: 'Aprobada' };
        if (s.includes('pend')) return { class: styles.badgePendiente, text: 'Pendiente' };
        if (s.includes('cancel') || s.includes('deni') || s.includes('reject')) return { class: styles.badgeCancelada, text: 'Cancelada' };
        if (s.includes('finish') || s.includes('complet')) return { class: styles.badgeDevuelto, text: 'Completada' };
        return { class: styles.badgeDefault, text: statusStr || 'Desconocido' };
    };

    const hasReservations = filteredReservations.length > 0;

    return (
        <div className={styles.historySection}>
            <h3 className={styles.historyTitle}>HISTORIAL INDIVIDUAL</h3>

            {hasReservations ? (
                <div className={styles.historyGrid}>
                    {filteredReservations.map((res, index) => {
                        const badgeInfo = determineBadgeInfo(res.status);
                        const isCancel = badgeInfo.text === 'Cancelada';
                        const borderClass = isCancel ? styles.borderOrange : styles.borderPurple;
                        
                        return (
                            <div key={res.id || index} className={`${styles.historyCard} ${borderClass}`}>
                                <div className={styles.cardTop}>
                                    <div className={styles.userInfo}>
                                        <div className={styles.avatar}>
                                            {getInitials(res.user?.firstName || res.petitioner?.firstName, res.user?.lastName || res.petitioner?.lastName)}
                                        </div>
                                        <div className={styles.userDetails}>
                                            <h4 className={styles.userName}>
                                                {res.user?.firstName || res.petitioner?.firstName} {res.user?.lastName || res.petitioner?.lastName}
                                            </h4>
                                            <span className={styles.userRole}>
                                                {res.user?.role || res.petitioner?.role || 'Estudiante'}
                                            </span>
                                        </div>
                                    </div>
                                    <span className={`${styles.badge} ${badgeInfo.class}`}>
                                        {badgeInfo.text}
                                    </span>
                                </div>
                                <div className={styles.cardBottom}>
                                    <div className={styles.cardInfo}>
                                        <FiCalendar />
                                        <span>Solicitado: {formatDate(res.createdAt || res.date)}</span>
                                    </div>
                                    <div className={styles.cardInfo}>
                                        <FiMapPin />
                                        <span>{reservableType === 'EQUIPMENT' ? 'Espacio: ' : 'Lugar: '} {res.space?.name || res.reservable?.name || '—'}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIconWrapper}>
                        <FiClipboard />
                    </div>
                    <h3>Sin historial</h3>
                    <p>Este recurso aún no ha sido solicitado ni prestado. El historial se mostrará aquí una vez que se registren solicitudes.</p>
                </div>
            )}
        </div>
    );
}

export default HistoryList;
