import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../../../api/client';
import LoaderCircle from '../../../assets/components/LoaderCircle';
import { Alert } from '@mui/material';
import { IoMdNotificationsOutline } from "react-icons/io";
import { FiArrowLeft, FiX, FiCheck, FiPlus } from "react-icons/fi";
import styles from '../styles/ReservationDetail.module.css';

function ReservationDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const {
        data: reservation,
        isPending,
        error
    } = useQuery({
        queryKey: ["GetReservation", id],
        queryFn: () => apiFetch(`/reservations/${id}`, { method: "GET" })
    });

    const approveMutation = useMutation({
        mutationFn: () => apiFetch(`/reservations/${id}/approve`, { method: "PATCH" }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["GetReservation", id] });
            queryClient.invalidateQueries({ queryKey: ["GetRequests"] });
        }
    });

    const rejectMutation = useMutation({
        mutationFn: () => apiFetch(`/reservations/${id}/reject`, { method: "PATCH" }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["GetReservation", id] });
            queryClient.invalidateQueries({ queryKey: ["GetRequests"] });
        }
    });

    if (error) {
        return (
            <div className={styles.container} style={{ padding: '20px' }}>
                <Alert severity="error">Error al cargar la solicitud: {error.message}</Alert>
                <button className={styles.backButton} onClick={() => navigate('/requests')} style={{ marginTop: '20px' }}>
                    <FiArrowLeft /> Volver
                </button>
            </div>
        );
    }

    if (isPending) {
        return <LoaderCircle />;
    }

    if (!reservation) return null;

    const translateStatus = (status) => {
        const mapping = {
            PENDING: 'Pendiente',
            APPROVED: 'Aprobada',
            DENIED: 'Denegada',
            COMPLETED: 'Completada'
        };
        return mapping[status] || status;
    };

    const calculateDuration = (start, end) => {
        if (!start || !end) return '—';
        const startParts = start.split(':');
        const endParts = end.split(':');
        let hours = parseInt(endParts[0]) - parseInt(startParts[0]);
        let minutes = parseInt(endParts[1]) - parseInt(startParts[1]);
        if (minutes < 0) {
            hours -= 1;
            minutes += 60;
        }
        let result = '';
        if (hours > 0) result += `${hours} hora${hours > 1 ? 's' : ''} `;
        if (minutes > 0) result += `${minutes} min`;
        return result.trim() || '—';
    };

    const handleApprove = () => {
        if (window.confirm("¿Seguro que deseas aprobar esta solicitud?")) {
            approveMutation.mutate();
        }
    };

    const handleReject = () => {
        if (window.confirm("¿Seguro que deseas denegar esta solicitud?")) {
            rejectMutation.mutate();
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <h1 style={{ margin: 0, fontSize: '32px' }}>Solicitudes</h1>
                    <button className={styles.backButton} onClick={() => navigate('/requests')}>
                        <FiArrowLeft /> Volver
                    </button>
                </div>
                <button className={styles.notificationButton}>
                    <IoMdNotificationsOutline size={24} color="#64748B" />
                </button>
            </div>

            <div className={styles.mainCard}>
                <div className={styles.cardHeader}>
                    <h2>Resolver solicitud</h2>
                </div>

                <div className={styles.contentRow}>
                    {/* LEFT COLUMN */}
                    <div className={styles.column}>
                        
                        {/* INFORMACIÓN */}
                        <div className={styles.infoBlock}>
                            <h3 className={styles.blockTitle}>Información</h3>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Solicitante</span>
                                <span className={styles.infoValue}>
                                    {reservation.petitioner?.firstName} {reservation.petitioner?.lastName}
                                </span>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Tipo de usuario</span>
                                <span className={styles.infoValue}>
                                    {reservation.petitioner?.role === 'ADMIN' ? 'Administrador' : reservation.petitioner?.role || 'Personal Institucional'}
                                </span>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Recurso</span>
                                <span className={styles.infoValue} style={{ color: '#8B5CF6' }}>
                                    {reservation.reservable?.name}
                                </span>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Tipo recurso</span>
                                <span className={styles.infoValue}>
                                    {reservation.reservable?.reservableType === 'SPACE' ? 'Espacio' : 'Equipo'}
                                </span>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Capacidad</span>
                                <span className={styles.infoValue}>
                                    {reservation.reservable?.spaceAttached?.capacity || reservation.reservable?.capacity || '—'} {reservation.reservable?.reservableType === 'SPACE' ? 'personas' : ''}
                                </span>
                            </div>
                        </div>

                        {/* DETALLES */}
                        <div className={styles.infoBlock}>
                            <h3 className={styles.blockTitle}>Detalles</h3>
                            {/* In standard reservation JSON, purpose might be in notes or inferred from type, adding placeholder if null */}
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Propósito</span>
                                <span className={styles.infoValue}>
                                    {reservation.type === 'GROUP' ? 'Reunión de grupo' : 'Individual'}
                                </span>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Asistentes</span>
                                <span className={styles.infoValue}>
                                    {reservation.companions || 0} personas
                                </span>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Estado</span>
                                <span className={styles.infoValue}>
                                    <span className={`${styles.badge} ${styles['badge' + reservation.status]}`}>
                                        {translateStatus(reservation.status)}
                                    </span>
                                </span>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Fecha solicitud</span>
                                <span className={styles.infoValue}>
                                    {new Date(reservation.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                            </div>

                            {reservation.status === 'APPROVED' && (
                                <div className={styles.realDatesRow}>
                                    <div className={styles.dateInputGroup}>
                                        <label>Fecha de entrega</label>
                                        <input type="date" />
                                    </div>
                                    <div className={styles.dateInputGroup}>
                                        <label>Fecha devolución</label>
                                        <input type="date" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className={styles.column}>

                        {/* FECHA Y HORA */}
                        <div className={styles.infoBlock}>
                            <h3 className={styles.blockTitle}>Fecha y hora</h3>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Fecha</span>
                                <span className={styles.infoValue}>
                                    {new Date(reservation.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Hora inicio</span>
                                <span className={styles.infoValue}>{reservation.startTime}</span>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Hora fin</span>
                                <span className={styles.infoValue}>{reservation.endTime}</span>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Duración</span>
                                <span className={styles.infoValue}>
                                    {calculateDuration(reservation.startTime, reservation.endTime)}
                                </span>
                            </div>
                        </div>

                        {/* OBSERVACIONES */}
                        <div className={styles.infoBlock}>
                            <h3 className={styles.blockTitle}>
                                Observaciones
                                <button className={styles.addNoteBtn} title="Añadir observación">
                                    <FiPlus size={16} />
                                </button>
                            </h3>
                            {reservation.notes && reservation.notes.length > 0 ? (
                                reservation.notes.map((note) => (
                                    <div key={note.id} className={styles.noteItem}>
                                        <div className={styles.noteText}>
                                            {note.comment}
                                        </div>
                                        <div className={styles.noteFooter}>
                                            {new Date(note.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}, {new Date(note.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit'})} - {note.createdBy?.firstName || 'Admin'}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: '#94A3B8', fontSize: '13px', margin: 0 }}>No hay observaciones.</p>
                            )}
                        </div>

                        {/* PROPÓSITO BLOQUE EXTRA (de la imagen) */}
                        <div className={styles.infoBlock}>
                            <h3 className={styles.blockTitle}>Propósito</h3>
                            <div className={styles.purposeBlock}>
                                {reservation.purpose || 'Propósito general de la reservación o detalle especificado por el usuario al solicitar.'}
                            </div>
                        </div>

                    </div>
                </div>

                <div className={styles.footer}>
                    {reservation.status === 'PENDING' && (
                        <>
                            <button 
                                className={styles.btnDeny} 
                                onClick={handleReject}
                                disabled={rejectMutation.isPending}
                            >
                                <FiX /> Denegar
                            </button>
                            <button 
                                className={styles.btnApprove} 
                                onClick={handleApprove}
                                disabled={approveMutation.isPending}
                            >
                                <FiCheck /> Aprobar
                            </button>
                        </>
                    )}
                    {reservation.status === 'APPROVED' && (
                        <>
                            <button className={styles.btnOutline} onClick={() => navigate('/requests')}>
                                <FiX /> Cancelar
                            </button>
                            <button className={styles.btnSave}>
                                <FiCheck /> Guardar
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ReservationDetail;
