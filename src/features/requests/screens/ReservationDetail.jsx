import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../../../api/client';
import LoaderCircle from '../../../assets/components/LoaderCircle';
import { Alert } from '@mui/material';
import { FiArrowLeft, FiX, FiCheck, FiPlus, FiSend, FiEdit3 } from "react-icons/fi";
import { useAuth } from '../../../context/AuthContext';
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

    const {
        data: b_user
    } = useQuery({
        queryKey: ["GetUser"],
        queryFn: () => apiFetch(`/users/me`, { method: "GET" }),
        retry: (failureCount, error) => error.status !== 404,
    });

    const [modalData, setModalData] = useState({
        isOpen: false,
        type: '', // 'APPROVE', 'REJECT', 'CANCEL', 'EDIT_NOTE'
        title: '',
        label: '',
        inputValue: '',
        noteId: null
    });

    const [chatInput, setChatInput] = useState('');

    const approveMutation = useMutation({
        mutationFn: (observation) => apiFetch(`/reservations/${id}/approve`, {
            method: "PATCH",
            body: JSON.stringify({ observation })
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["GetReservation", id] });
            queryClient.invalidateQueries({ queryKey: ["GetRequests"] });
            setModalData({ ...modalData, isOpen: false, inputValue: '' });
        }
    });

    const rejectMutation = useMutation({
        mutationFn: (reason) => apiFetch(`/reservations/${id}/reject`, {
            method: "PATCH",
            body: JSON.stringify({ reason })
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["GetReservation", id] });
            queryClient.invalidateQueries({ queryKey: ["GetRequests"] });
            setModalData({ ...modalData, isOpen: false, inputValue: '' });
        }
    });

    const cancelMutation = useMutation({
        mutationFn: (reason) => apiFetch(`/reservations/${id}/cancel`, {
            method: "PATCH",
            body: JSON.stringify({ reason })
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["GetReservation", id] });
            queryClient.invalidateQueries({ queryKey: ["GetRequests"] });
            setModalData({ ...modalData, isOpen: false, inputValue: '' });
        }
    });

    const addNoteMutation = useMutation({
        mutationFn: (comment) => apiFetch(`/reservations/${id}/notes`, {
            method: "POST",
            body: JSON.stringify({ reservationId: parseInt(id), comment })
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["GetReservation", id] });
            setChatInput('');
        }
    });

    const updateNoteMutation = useMutation({
        mutationFn: ({ noteId, comment }) => apiFetch(`/reservations/${id}/notes/${noteId}`, {
            method: "PATCH",
            body: JSON.stringify({ comment })
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["GetReservation", id] });
            queryClient.invalidateQueries({ queryKey: ["GetRequests"] });
            setModalData({ ...modalData, isOpen: false, inputValue: '' });
        }
    });

    const finishMutation = useMutation({
        mutationFn: (returnedLate) => apiFetch(`/reservations/${id}/finish`, {
            method: "PATCH",
            body: JSON.stringify({ returnedLate })
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["GetReservation", id] });
            queryClient.invalidateQueries({ queryKey: ["GetRequests"] });
            alert("Reservación marcada con entrega tardía");
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

    const isSpace = reservation.reservableType === 'SPACE' || reservation.reservable?.reservableType === 'SPACE';

    const translateStatus = (status) => {
        const mapping = {
            PENDING: 'Pendiente',
            APPROVED: 'Aprobada',
            DENIED: 'Denegada',
            REJECTED: 'Denegada',
            COMPLETED: 'Completada',
            FINISHED: 'Completada',
            CANCELLED: 'Cancelada',
            IN_PROGRESS: 'En progreso'
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
        setModalData({
            isOpen: true,
            type: 'APPROVE',
            title: 'Aprobar solicitud',
            label: 'Observación (opcional)',
            inputValue: '',
            noteId: null
        });
    };

    const handleReject = () => {
        setModalData({
            isOpen: true,
            type: 'REJECT',
            title: 'Rechazar solicitud',
            label: 'Motivo de rechazo',
            inputValue: '',
            noteId: null
        });
    };

    const handleCancel = () => {
        setModalData({
            isOpen: true,
            type: 'CANCEL',
            title: 'Cancelar reservación',
            label: 'Motivo de cancelación',
            inputValue: '',
            noteId: null
        });
    };

    const handleEditNote = (note) => {
        setModalData({
            isOpen: true,
            type: 'EDIT_NOTE',
            title: 'Editar observación',
            label: 'Observación',
            inputValue: note.comment,
            noteId: note.id
        });
    };

    const handleModalSubmit = () => {
        if (modalData.type === 'APPROVE') {
            approveMutation.mutate(modalData.inputValue);
        } else if (modalData.type === 'REJECT') {
            if (!modalData.inputValue.trim()) return alert("Debe ingresar un motivo");
            rejectMutation.mutate(modalData.inputValue);
        } else if (modalData.type === 'CANCEL') {
            if (!modalData.inputValue.trim()) return alert("Debe ingresar un motivo");
            cancelMutation.mutate(modalData.inputValue);
        } else if (modalData.type === 'EDIT_NOTE') {
            if (!modalData.inputValue.trim()) return alert("El comentario no puede estar vacío");
            updateNoteMutation.mutate({ noteId: modalData.noteId, comment: modalData.inputValue });
        }
    };

    const handleSendNote = () => {
        if (!chatInput.trim()) return;
        addNoteMutation.mutate(chatInput);
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
            </div>

            {reservation.petitioner?.lateReturnsCount > 0 && (
                <Alert severity="warning" style={{ marginBottom: '20px', borderRadius: '12px' }}>
                    <strong>Atención:</strong> El solicitante tiene <strong>{reservation.petitioner.lateReturnsCount}</strong> {reservation.petitioner.lateReturnsCount === 1 ? 'entrega tardía registrada' : 'entregas tardías registradas'}.
                </Alert>
            )}

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
                                    {(reservation.petitioner?.firstName || reservation.user?.firstName || "Usuario")} {(reservation.petitioner?.lastName || reservation.user?.lastName || "")}
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
                                    {(reservation.reservableType === 'SPACE' || reservation.reservable?.reservableType === 'SPACE') ? 'Espacio' : 'Equipo'}
                                </span>
                            </div>
                            {isSpace && (
                                <div className={styles.infoRow}>
                                    <span className={styles.infoLabel}>Capacidad</span>
                                    <span className={styles.infoValue}>
                                        {reservation.reservable?.spaceAttached?.capacity || reservation.reservable?.capacity || '—'} personas
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* DETALLES */}
                        <div className={styles.infoBlock}>
                            <h3 className={styles.blockTitle}>Detalles</h3>
                            {/* In standard reservation JSON, purpose might be in notes or inferred from type, adding placeholder if null */}
                            {isSpace && (
                                <>
                                    <div className={styles.infoRow}>
                                        <span className={styles.infoLabel}>Tipo de reserva</span>
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
                                </>
                            )}
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Estado</span>
                                <span className={styles.infoValue}>
                                    <span className={`${styles.badge} ${styles['badge' + reservation.status]}`}>
                                        {translateStatus(reservation.status)}
                                    </span>
                                    {reservation.returnedLate && (
                                        <span className={styles.badge} style={{ backgroundColor: '#FEE2E2', color: '#EF4444', marginLeft: '8px', border: '1px solid #FCA5A5' }}>
                                            Entrega tardía
                                        </span>
                                    )}
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

                        {/* OBSERVACIONES / CHAT */}
                        <div className={styles.infoBlock}>
                            <h3 className={styles.blockTitle}>
                                OBSERVACIONES / CHAT
                            </h3>
                            <div className={styles.chatContainer}>
                                {reservation.notes && reservation.notes.length > 0 ? (
                                    reservation.notes.map((note) => {
                                        const isMe = note.createdBy?.id === b_user?.id;
                                        return (
                                            <div key={note.id} className={`${styles.chatBubbleContainer} ${isMe ? styles.chatMe : styles.chatOthers}`}>
                                                {!isMe && <p className={styles.chatAuthor}>{note.createdBy?.firstName} {note.createdBy?.lastName}</p>}
                                                <div className={styles.chatBubble}>
                                                    <div className={styles.chatText}>{note.comment}</div>
                                                    <div className={styles.chatFooter}>
                                                        <span>{new Date(note.createdAt).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                                        {isMe && (
                                                            <button className={styles.editNoteInline} onClick={() => handleEditNote(note)}>
                                                                <FiEdit3 size={12} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p style={{ color: '#94A3B8', fontSize: '13px', margin: '20px 0', textAlign: 'center' }}>No hay observaciones.</p>
                                )}
                            </div>

                            <div className={styles.chatInputArea}>
                                <div className={styles.chatInputWrapper}>
                                    <textarea
                                        placeholder="Escribir observación..."
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendNote();
                                            }
                                        }}
                                    />
                                    <button className={styles.sendButton} onClick={handleSendNote} disabled={addNoteMutation.isPending}>
                                        <FiSend size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* BIG CANCEL BUTTON (IMAGE 2) */}
                        {['PENDING', 'APPROVED'].includes(reservation.status) && (
                            <div className={styles.cancelActionArea}>
                                <button className={styles.btnCancelLarge} onClick={handleCancel}>
                                    <FiX size={24} /> Cancelar Reserva
                                </button>
                                <p className={styles.cancelHint}>Esta acción cancelará la reservación activa.</p>
                            </div>
                        )}

                        {/* PROPÓSITO BLOQUE EXTRA (de la imagen) */}
                        <div className={styles.infoBlock}>
                            <h3 className={styles.blockTitle}>Propósito</h3>
                            <div className={styles.purposeBlock}>
                                {reservation.requestReason || 'No se especificó un propósito para esta reservación.'}
                            </div>
                        </div>

                        {reservation.rejectionReason && (
                            <div className={styles.infoBlock} style={{ borderLeft: '4px solid #EF4444' }}>
                                <h3 className={styles.blockTitle} style={{ color: '#EF4444' }}>Motivo de rechazo</h3>
                                <div className={styles.purposeBlock} style={{ backgroundColor: '#FEF2F2', borderLeft: 'none' }}>
                                    {reservation.rejectionReason}
                                </div>
                            </div>
                        )}

                        {reservation.approvalObservation && (
                            <div className={styles.infoBlock} style={{ borderLeft: '4px solid #10B981' }}>
                                <h3 className={styles.blockTitle} style={{ color: '#10B981' }}>Observación de aprobación</h3>
                                <div className={styles.purposeBlock} style={{ backgroundColor: '#ECFDF5', borderLeft: 'none' }}>
                                    {reservation.approvalObservation}
                                </div>
                            </div>
                        )}

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
                    {reservation.status === 'FINISHED' && !reservation.returnedLate && (
                        <button
                            className={styles.btnDeny}
                            onClick={() => {
                                if (window.confirm("¿Seguro que desea marcar esta reservación con entrega tardía?")) {
                                    finishMutation.mutate(true);
                                }
                            }}
                            disabled={finishMutation.isPending}
                            style={{ width: 'auto', padding: '0 20px' }}
                        >
                            <FiX /> Marcar entrega tardía
                        </button>
                    )}
                </div>
            </div>
            {/* ACTION MODAL */}
            {modalData.isOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h3>{modalData.title}</h3>
                        <p className={styles.modalLabel}>{modalData.label}</p>
                        <textarea
                            className={styles.modalInput}
                            value={modalData.inputValue}
                            onChange={(e) => setModalData({ ...modalData, inputValue: e.target.value })}
                            placeholder="Escribe aquí..."
                            autoFocus
                        />
                        <div className={styles.modalActions}>
                            <button className={styles.modalBtnCancel} onClick={() => setModalData({ ...modalData, isOpen: false })}>
                                Cancelar
                            </button>
                            <button
                                className={styles.modalBtnConfirm}
                                onClick={handleModalSubmit}
                                disabled={approveMutation.isPending || rejectMutation.isPending || cancelMutation.isPending || updateNoteMutation.isPending}
                            >
                                <FiCheck /> Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ReservationDetail;
