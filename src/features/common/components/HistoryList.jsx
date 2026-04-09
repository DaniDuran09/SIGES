import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../../api/client";
import { FiCalendar, FiMapPin, FiClipboard } from "react-icons/fi";
import LoaderCircle from "../../../assets/components/LoaderCircle";
import styles from "./HistoryList.module.css";
import React from 'react';

function HistoryList({ resourceId, resourceName, reservableType }) {
    const { data: reservationsRaw, isPending } = useQuery({
        queryKey: ["GetResourceReservations", resourceId],
        queryFn: () => apiFetch(`/reservations`, {
            method: "GET",
            params: { reservableId: resourceId }
        }),
        retry: false
    });

    if (isPending) return <LoaderCircle />;

    const reservs = Array.isArray(reservationsRaw) ? reservationsRaw : (reservationsRaw?.content || []);

    const validStates = ['approve', 'cancel', 'finish', 'approved', 'canceled', 'completed', 'devuelto', 'cancelada', 'aprobada'];
    const filteredReservations = reservs.filter(r =>
        r.status && validStates.some(vs => r.status.toLowerCase().includes(vs))
    );

    const formatDate = (dateString) => {
        if (!dateString) return "Fecha desconocida";
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const getInitials = (firstName, lastName) => {
        return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase() || 'U';
    };

    const determineBadgeInfo = (statusStr) => {
        const s = (statusStr || '').toLowerCase();
        if (s.includes('approv')) return { class: styles.badgeAprobada, text: 'Aprobada' };
        if (s.includes('cancel') || s.includes('denied')) return { class: styles.badgeCancelada, text: 'Cancelada' };
        if (s.includes('finish') || s.includes('complet') || s.includes('devuelt')) return { class: styles.badgeDevuelto, text: 'Devuelto' };
        return { class: styles.badgeDevuelto, text: statusStr || 'Desconocido' };
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
