import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../../api/client";
import { FiArrowLeft, FiPlus, FiTrash2 } from "react-icons/fi";
import { useState } from "react";
import LoaderCircle from "../../../assets/components/LoaderCircle";
import { Alert } from "@mui/material";
import HistoryList from "../../common/components/HistoryList";
import AddAssetModal from "../components/AddAssetModal";
import styles from "./SpaceDetail.module.css";

function SpaceDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showAddAsset, setShowAddAsset] = useState(false);

    const { data: space, isPending, error } = useQuery({
        queryKey: ["GetSpaceDetail", id],
        queryFn: () => apiFetch(`/spaces/${id}`, { method: "GET" }),
    });

    if (isPending) return <LoaderCircle />;

    if (error) {
        return (
            <div className={styles.container}>
                <button className={styles.backButton} onClick={() => navigate("/spaces")}>
                    <FiArrowLeft /> Volver
                </button>
                <Alert severity="error">Error al cargar el detalle del espacio: {error.message}</Alert>
            </div>
        );
    }

    const dayMapping = {
        MONDAY: "Lunes",
        TUESDAY: "Martes",
        WEDNESDAY: "Miércoles",
        THURSDAY: "Jueves",
        FRIDAY: "Viernes",
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h4>Gestión</h4>
                <div className={styles.headerRow}>
                    <h1>Espacios</h1>
                </div>
            </div>

            <button className={styles.backButton} onClick={() => navigate("/spaces")}>
                <FiArrowLeft /> Volver
            </button>

            <div className={styles.mainCard}>
                <div className={styles.cardHeader}>
                    <h2>{space.name}</h2>
                    <span className={`${styles.statusBadge} ${space.status === 'AVAILABLE' ? styles.available : styles.unavailable}`}>
                        {space.status === 'AVAILABLE' ? 'Disponible' : 'No Disponible'}
                    </span>
                </div>

                <div className={styles.cardContent}>
                    {/* Left Column */}
                    <div>
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>INFORMACIÓN</h3>
                            <div className={styles.infoGrid}>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Tipo de espacio</span>
                                    <span className={styles.infoValue}>{space.spaceType?.name || '—'}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Ubicación</span>
                                    <span className={styles.infoValue}>{space.building?.name || '—'}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Capacidad máxima</span>
                                    <span className={styles.infoValue}>{space.capacity} personas</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Restricción</span>
                                    <span className={`${styles.infoValue} ${!space.availableForStudents ? styles.restrictionAlert : ''}`}>
                                        {space.availableForStudents ? 'Todos los estudiantes' : 'Solo personal institucional'}
                                    </span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Fecha de registro</span>
                                    <span className={styles.infoValue}>{new Date(space.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Tiempo de anticipación</span>
                                    <span className={styles.infoValue}>{space.bookInAdvanceDuration}</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>
                                EQUIPAMIENTO INTEGRADO{" "}
                                <span
                                    className={styles.plusIcon}
                                    onClick={() => setShowAddAsset(true)}
                                    style={{ cursor: "pointer" }}
                                    title="Agregar equipamiento"
                                >
                                    <FiPlus size={12} />
                                </span>
                            </h3>
                            <div className={styles.tags}>
                                {space.assets?.length > 0 ? (
                                    space.assets.map((asset) => (
                                        <span key={asset.id} className={styles.tag}>{asset.name}</span>
                                    ))
                                ) : (
                                    <span className={styles.infoLabel}>No hay equipamiento registrado</span>
                                )}
                            </div>
                        </div>

                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>DISPONIBILIDAD DE HORARIOS</h3>
                            <div className={styles.infoGrid}>
                                {space.availabilitySlots?.length > 0 ? (
                                    space.availabilitySlots.map((slot) => (
                                        <div key={slot.id} className={styles.scheduleItem}>
                                            <div className={styles.scheduleDay}>
                                                <h4>{slot.daysOfWeek.map(d => dayMapping[d]).join(', ')}</h4>
                                                <p>{slot.startTime} - {slot.endTime}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <span className={styles.infoLabel}>No hay horarios definidos</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div>
                        {/* 
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>ESTADÍSTICAS DE USO</h3>
                            <div className={styles.statsGrid}>
                                <div className={styles.statCard}>
                                    <span className={styles.statValue}>87%</span>
                                    <span className={styles.statLabel}>TASA DE OCUPACIÓN</span>
                                </div>
                                <div className={styles.statCard}>
                                    <span className={styles.statValue}>24</span>
                                    <span className={styles.statLabel}>RESERVAS ESTE MES</span>
                                </div>
                            </div>
                        </div>
                        */}

                        <HistoryList 
                            resourceId={id} 
                            resourceName={space.name} 
                            reservableType="SPACE" 
                        />

                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>DESCRIPCIÓN</h3>
                            <div className={styles.descriptionBox}>
                                {space.description || 'Sin descripción disponible.'}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {showAddAsset && (
                <AddAssetModal
                    spaceId={id}
                    onClose={() => setShowAddAsset(false)}
                />
            )}
        </div>
    );
}

export default SpaceDetail;
