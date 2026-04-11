import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../../api/client";
import { FiArrowLeft, FiTrash2, FiEdit2 } from "react-icons/fi";
import LoaderCircle from "../../../assets/components/LoaderCircle";
import HistoryList from "../../common/components/HistoryList";
import styles from "../styles/EquipmentDetail.module.css";

function EquipmentDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: equipment, isPending, error } = useQuery({
        queryKey: ["GetEquipmentDetail", id],
        queryFn: () => apiFetch(`/equipments/${id}`, { method: "GET" }),
        retry: (count, err) => err.status !== 404 && count < 2
    });

    const dayMapping = {
        MONDAY: "Lunes",
        TUESDAY: "Martes",
        WEDNESDAY: "Miércoles",
        THURSDAY: "Jueves",
        FRIDAY: "Viernes",
        SATURDAY: "Sábado",
        SUNDAY: "Domingo"
    };

    if (isPending) return <LoaderCircle />;

    if (error || !equipment) {
        return (
            <div className={styles.container}>
                <button className={styles.backButton} onClick={() => navigate("/equipment")}>
                    <FiArrowLeft /> Volver a Equipos
                </button>
                <div style={{ textAlign: 'center', marginTop: '50px', color: '#6b7280' }}>
                    <h2>No se encontró el equipo</h2>
                    <p>El equipo con ID {id} no existe o no se pudo cargar.</p>
                </div>
            </div>
        );
    }

    const isAvailable = equipment.status === "AVAILABLE";

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h4>Gestión</h4>
                <div className={styles.headerRow}>
                    <h1>Equipos</h1>
                </div>
            </div>

            <button className={styles.backButton} onClick={() => navigate("/equipment")}>
                <FiArrowLeft /> Volver
            </button>

            <div className={styles.mainCard}>
                <div className={styles.cardHeader}>
                    <h2>{equipment.name}</h2>
                    <span className={`${styles.statusBadge} ${isAvailable ? styles.available : styles.unavailable}`}>
                        {isAvailable ? "Disponible" : equipment.status === "LOANED" ? "En préstamo" : "Mantenimiento"}
                    </span>
                </div>

                <div className={styles.contentGrid}>
                    {/* Left Column: Info */}
                    <div>
                        <div className={styles.infoSection}>
                            <h3 style={{ color: '#6B7280' }}>Información</h3>
                            <div className={styles.infoList}>
                                <div className={styles.infoItem}>
                                    <span>Tipo de equipo</span>
                                    <span>{equipment.type?.name || "Router"}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span>Número de inventario</span>
                                    <span>{equipment.inventoryIdNum || "INV-2026-025"}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span>Espacio asociado</span>
                                    <span>{equipment.spaceAttached?.name || "Lab de Cómputo 1"}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span>Restricción</span>
                                    <span className={!equipment.availableForStudents ? styles.coralText : ""}>
                                        {!equipment.availableForStudents ? "Solo personal institucional" : "Público"}
                                    </span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span>Fecha de registro</span>
                                    <span>{equipment.createdAt ? new Date(equipment.createdAt).toLocaleDateString() : "15 Enero 2026"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Specs */}
                        <div className={`${styles.detailBox} ${styles.specsSection}`} style={{ marginTop: '48px' }}>
                            <h3 style={{ color: '#6B7280' }}>Especificaciones Técnicas +</h3>
                            <div className={styles.tags}>
                                <span className={styles.tag}>Proyector 4k</span>
                                <span className={styles.tag}>Sistema de audio</span>
                                <span className={styles.tag}>Aire acondicionado</span>
                                <span className={styles.tag}>Micrófonos inalámbricos (4)</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Stats & Description */}
                    <div>
                        {/* 
                         <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#6B7280' }}>
                            ESTADÍSTICAS DE USO
                            <button onClick={() => { navigate(`/equipment/${id}/history`) }} style={{ backgroundColor: 'transparent', border: '0px', cursor: 'pointer' }}>
                                <h3 style={{ color: '#9CA3AF' }}>ver historial {'>'}</h3>
                            </button>
                        </h3>
                        <div className={styles.statsRow}>
                            <div className={styles.statCard}>
                                <span className={styles.statValue}>12</span>
                                <span className={styles.statLabel}>Préstamos Totales</span>
                            </div>
                            <div className={styles.statCard}>
                                <span className={styles.statValue}>4.8</span>
                                <span className={styles.statLabel}>Días Promedio</span>
                            </div>
                        </div>
                        */}

                        <HistoryList
                            resourceId={id}
                            resourceName={equipment.name}
                            reservableType="EQUIPMENT"
                        />

                        <div className={styles.detailBox} style={{ marginTop: '48px' }}>
                            <h3 style={{ color: '#6B7280' }}>Descripción</h3>
                            <p>{equipment.description || "Router industrial de grado empresarial diseñado para entornos de alta demanda. Ofrece conectividad robusta y segura para laboratorios de cómputo y espacios con múltiples dispositivos simultáneos."}</p>
                        </div>

                    </div>

                    {/* Bottom: Schedule (Full Width) */}
                    <div className={`${styles.detailBox} ${styles.scheduleSection}`} style={{ gridColumn: '1 / -1', borderTop: '1px solid #f3f4f6', paddingTop: '32px' }}>
                        <h3 style={{ color: '#6B7280' }}>Disponibilidad de Horarios</h3>
                        {equipment.availabilitySlots?.length > 0 ? (
                            equipment.availabilitySlots.map(slot => (
                                <div key={slot.id} className={styles.observationBox} style={{ background: 'white', border: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <strong>{slot.daysOfWeek.map(d => dayMapping[d] || d).join(", ")}</strong>
                                        <p>{slot.startTime} - {slot.endTime}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No hay horarios configurados.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EquipmentDetail;
