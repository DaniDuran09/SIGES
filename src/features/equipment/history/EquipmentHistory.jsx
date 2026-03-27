import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../../api/client";
import { FiArrowLeft, FiCalendar, FiMapPin, FiClipboard } from "react-icons/fi";
import LoaderCircle from "../../../assets/components/LoaderCircle";
import styles from "./EquipmentHistory.module.css";
import React from 'react';

function EquipmentHistory() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Fetch equipment details to show the name
    const { data: equipment, isPending: isEquipPending } = useQuery({
        queryKey: ["GetEquipmentDetail", id],
        queryFn: () => apiFetch(`/equipments/${id}`, { method: "GET" }),
        retry: false
    });

    // Fetch reservations based on prompt specs
    const { data: reservationsRaw, isPending: isResPending } = useQuery({
        queryKey: ["GetEquipmentReservations", id],
        queryFn: () => apiFetch(`/reservation/${id}`, { method: "GET" }),
        retry: false
    });

    if (isEquipPending || isResPending) return <LoaderCircle />;

    const equipmentName = equipment?.name || "Pantalla Interactiva";

    // Format and filter the data
    const reservs = Array.isArray(reservationsRaw) ? reservationsRaw : (reservationsRaw?.content || []);
    
    // According to instructions, only show 'approve', 'cancel' and 'finish' states.
    // The data might match these directly or use uppercase/different values.
    // Let's filter by the requested states (case insensitive match for robust filtering).
    const validStates = ['approve', 'cancel', 'finish', 'approved', 'canceled', 'completed', 'devuelto', 'cancelada', 'aprobada'];
    const filteredReservations = reservs.filter(r => 
        r.status && validStates.some(vs => r.status.toLowerCase().includes(vs))
    );

    // Calculate stats
    // the UI shows totals like 12, 8, 3, 1 even if the array has fewer, 
    // but we will calculate it dynamically based on the filtered data based on states if possible, or all data.
    const totalPrestamos = reservs.length;
    const aprobadas = reservs.filter(r => r.status?.toLowerCase().includes('approv')).length;
    const activas = reservs.filter(r => r.status?.toLowerCase().includes('finish') || r.status?.toLowerCase().includes('complet') || r.status?.toLowerCase().includes('devuelto')).length + 
                    reservs.filter(r => r.status?.toLowerCase().includes('pending') || r.status?.toLowerCase().includes('active')).length; // Just an approximation based on design "activas = 3"
    const canceladas = reservs.filter(r => r.status?.toLowerCase().includes('cancel') || r.status?.toLowerCase().includes('denied')).length;

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
        if (s.includes('approv')) return { class: styles.badgeAprobada, text: 'Aprobada' };
        if (s.includes('cancel') || s.includes('denied')) return { class: styles.badgeCancelada, text: 'Cancelada' };
        if (s.includes('finish') || s.includes('complet') || s.includes('devuelt')) return { class: styles.badgeDevuelto, text: 'Devuelto' };
        return { class: styles.badgeDevuelto, text: statusStr || 'Desconocido' };
    };

    const hasReservations = filteredReservations.length > 0;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h4>Gestión</h4>
                <div className={styles.headerRow}>
                    <h1>Equipos</h1>
                </div>
            </div>

            <button className={styles.backButton} onClick={() => navigate(`/equipment/${id}`)}>
                <FiArrowLeft /> Volver
            </button>

            <div className={styles.mainCard}>
                <div className={styles.cardHeader}>
                    <h2>{equipmentName}</h2>
                    <span className={styles.subtitle}>(Historial)</span>
                </div>

                <div className={styles.content}>
                    <div className={styles.statsRow}>
                        <div className={styles.statCard}>
                            <span className={styles.statValue}>{hasReservations ? totalPrestamos : 0}</span>
                            <span className={styles.statLabel}>Préstamos Totales</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statValue}>{hasReservations ? aprobadas : 0}</span>
                            <span className={styles.statLabel}>Aprobadas</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statValue}>{hasReservations ? activas : 0}</span>
                            <span className={styles.statLabel}>Activas</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statValue}>{hasReservations ? canceladas : 0}</span>
                            <span className={styles.statLabel}>Canceladas</span>
                        </div>
                    </div>

                    <h3 className={styles.historyTitle}>Historial de solicitudes</h3>

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
                                                    {getInitials(res.user?.firstName, res.user?.lastName)}
                                                </div>
                                                <div className={styles.userDetails}>
                                                    <h4 className={styles.userName}>
                                                        {res.user?.firstName} {res.user?.lastName}
                                                    </h4>
                                                    <span className={styles.userRole}>
                                                        {res.user?.role || 'Estudiante'}
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
                                                <span>Espacio: {res.space?.name || equipment?.spaceAttached?.name || 'Lab de Cómputo 1'}</span>
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
                            <h3>Sin historial de préstamos</h3>
                            <p>Este equipo aún no ha sido solicitado ni prestado a ningún usuario. El historial se mostrará aquí una vez que se registren solicitudes.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EquipmentHistory;
