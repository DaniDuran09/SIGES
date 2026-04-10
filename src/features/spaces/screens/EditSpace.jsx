import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../../api/client";
import { FiArrowLeft, FiPlus, FiTrash2, FiSave, FiX } from "react-icons/fi";
import LoaderCircle from "../../../assets/components/LoaderCircle";
import { Alert, Snackbar } from "@mui/material";
import styles from "./EditSpace.module.css";

function EditSpace() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [successMessage, setSuccessMessage] = useState("");

    const [showAddAvailModal, setShowAddAvailModal] = useState(false);

    const dayMapping = {
        MONDAY: "Lunes",
        TUESDAY: "Martes",
        WEDNESDAY: "Miércoles",
        THURSDAY: "Jueves",
        FRIDAY: "Viernes",
        SATURDAY: "Sábado",
        SUNDAY: "Domingo"
    };

    // Form states
    const [formData, setFormData] = useState({
        name: "",
        spaceTypeId: "",
        buildingId: "",
        capacity: "",
        bookInAdvanceDuration: "",
        advanceUnit: "HOURS",
        description: "",
        status: "AVAILABLE",
        availableForStudents: true,
        availabilitySlots: []
    });

    const { data: space, isPending, error } = useQuery({
        queryKey: ["GetSpaceForEdit", id],
        queryFn: () => apiFetch(`/spaces/${id}`, { method: "GET" }),
    });

    const { data: types } = useQuery({
        queryKey: ["GetSpaceTypes"],
        queryFn: () => apiFetch("/space-types", { method: "GET" }),
    });

    const { data: buildings } = useQuery({
        queryKey: ["GetBuildings"],
        queryFn: () => apiFetch("/buildings", { method: "GET" }),
    });

    useEffect(() => {
        if (space) {
            let durationPart = "";
            let unitPart = "HOURS";

            if (space.bookInAdvanceDuration) {
                const dur = space.bookInAdvanceDuration;
                if (dur.includes("M")) {
                    durationPart = dur.replace(/\D/g, "");
                    unitPart = "MINUTES";
                } else if (dur.includes("H")) {
                    durationPart = dur.replace(/\D/g, "");
                    unitPart = "HOURS";
                } else if (dur.includes("D")) {
                    durationPart = dur.replace(/\D/g, "");
                    unitPart = "DAYS";
                }
            }

            setFormData({
                name: space.name,
                spaceTypeId: space.spaceType?.id || "",
                buildingId: space.building?.id || "",
                capacity: space.capacity,
                bookInAdvanceDuration: durationPart,
                advanceUnit: unitPart,
                description: space.description,
                status: space.status || "AVAILABLE",
                availableForStudents: space.availableForStudents,
                availabilitySlots: space.availabilitySlots || []
            });
        }
    }, [space]);

    const mutation = useMutation({
        mutationFn: (updatedData) => apiFetch(`/spaces/${id}`, {
            method: "PUT",
            body: JSON.stringify(updatedData)
        }),
        onSuccess: () => {
            queryClient.invalidateQueries(["GetSpaceForEdit", id]);
            queryClient.invalidateQueries(["GetSpaces"]);
            setSuccessMessage("Espacio actualizado correctamente");
            setTimeout(() => navigate("/spaces"), 1500);
        }
    });

    const [selectedDays, setSelectedDays] = useState([]);
    const [newAvailStartTime, setNewAvailStartTime] = useState("");
    const [newAvailEndTime, setNewAvailEndTime] = useState("");

    const handleAddAvailability = () => {
        if (selectedDays.length === 0 || !newAvailStartTime || !newAvailEndTime) return;
        const newItem = {
            dateFrom: new Date().toISOString().split('T')[0],
            startTime: newAvailStartTime,
            endTime: newAvailEndTime,
            daysOfWeek: selectedDays
        };
        setFormData(prev => ({
            ...prev,
            availabilitySlots: [...(prev.availabilitySlots || []), newItem]
        }));
        setShowAddAvailModal(false);
        setSelectedDays([]);
        setNewAvailStartTime("");
        setNewAvailEndTime("");
    };

    const toggleDay = (day) => {
        setSelectedDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    const removeAvailability = (index) => {
        setFormData(prev => ({
            ...prev,
            availabilitySlots: (prev.availabilitySlots || []).filter((_, i) => i !== index)
        }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let bookInAdvanceDurationFormatted = "";
        if (formData.advanceUnit === "MINUTES") bookInAdvanceDurationFormatted = `PT${formData.bookInAdvanceDuration}M`;
        else if (formData.advanceUnit === "HOURS") bookInAdvanceDurationFormatted = `PT${formData.bookInAdvanceDuration}H`;
        else if (formData.advanceUnit === "DAYS") bookInAdvanceDurationFormatted = `P${formData.bookInAdvanceDuration}D`;

        const payload = {
            name: formData.name.trim(),
            description: formData.description.trim(),
            studentsAvailable: formData.availableForStudents,
            availableForStudents: formData.availableForStudents,
            buildingId: parseInt(formData.buildingId) || space?.building?.id || 0,
            availability: formData.availabilitySlots,
            exceptions: space?.exceptions || [],
            spaceTypeId: parseInt(formData.spaceTypeId) || space?.spaceType?.id || 0,
            bookInAdvanceDuration: bookInAdvanceDurationFormatted,
            capacity: parseInt(formData.capacity) || 0,
            equipment: space?.equipment || [],
            status: formData.status
        };

        mutation.mutate(payload);
    };

    if (isPending) return <LoaderCircle />;

    return (
        <div className={styles.container}>
            <Snackbar
                open={!!successMessage}
                autoHideDuration={6000}
                onClose={() => setSuccessMessage("")}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity="success" sx={{ width: '100%' }}>{successMessage}</Alert>
            </Snackbar>

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
                    <h2>Editar {formData.name}</h2>
                </div>

                <form className={styles.cardContent} onSubmit={handleSubmit}>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label>Nombre del espacio <span className={styles.requiredStar}>*</span></label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Tipo <span className={styles.requiredStar}>*</span></label>
                            <select
                                name="spaceTypeId"
                                value={formData.spaceTypeId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccionar tipo</option>
                                {types?.filter(t => t.deletedAt === null).map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Tiempo de anticipación <span className={styles.requiredStar}>*</span></label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    style={{ flex: 1 }}
                                    name="bookInAdvanceDuration"
                                    type="number"
                                    value={formData.bookInAdvanceDuration}
                                    onChange={handleChange}
                                    required
                                />
                                <select
                                    style={{ flex: 1 }}
                                    name="advanceUnit"
                                    value={formData.advanceUnit}
                                    onChange={handleChange}
                                >
                                    <option value="MINUTES">Minutos</option>
                                    <option value="HOURS">Horas</option>
                                    <option value="DAYS">Días</option>
                                </select>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Ubicación <span className={styles.requiredStar}>*</span></label>
                            <select
                                name="buildingId"
                                value={formData.buildingId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccionar edificio</option>
                                {buildings?.filter(b => b.deletedAt === null).map(b => (
                                    <option key={b.id} value={b.id}>{b.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Capacidad <span className={styles.requiredStar}>*</span></label>
                            <input
                                name="capacity"
                                type="number"
                                value={formData.capacity}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Estado inicial <span className={styles.requiredStar}>*</span></label>
                            <select name="status" value={formData.status} onChange={handleChange} required>
                                <option value="AVAILABLE">Disponible</option>
                                <option value="MAINTENANCE">Mantenimiento</option>
                                <option value="LOANED">En Uso</option>
                            </select>
                        </div>

                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                            <label>Descripción</label>
                            <textarea
                                name="description"
                                rows="4"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className={styles.scheduleSection}>
                        <div className={styles.scheduleHeader}>
                            <h3>Horarios configurados</h3>
                            <button type="button" className={styles.addButton} onClick={() => setShowAddAvailModal(true)}>
                                <FiPlus /> Agregar
                            </button>
                        </div>

                        {formData.availabilitySlots?.length > 0 ? (
                            formData.availabilitySlots.map((slot, index) => (
                                <div key={index} className={styles.scheduleItem}>
                                    <div>
                                        <div className={styles.dayLabel}>{slot.daysOfWeek.map(d => dayMapping[d] || d).join(', ')}</div>
                                        <div className={styles.timeLabel}>{slot.startTime} - {slot.endTime}</div>
                                    </div>
                                    <button type="button" className={styles.deleteBtn} onClick={() => removeAvailability(index)}>
                                        <FiTrash2 size={18} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p style={{ fontSize: '14px', color: '#6b7280', textAlign: 'center' }}>No hay horarios configurados.</p>
                        )}
                    </div>

                    <div className={styles.restrictionSection}>
                        <span className={styles.restrictionLabel}>Restringido para estudiantes</span>
                        <label className={styles.switch}>
                            <input
                                type="checkbox"
                                name="availableForStudents"
                                checked={!formData.availableForStudents}
                                onChange={(e) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        availableForStudents: !e.target.checked
                                    }));
                                }}
                            />
                            <span className={styles.slider}></span>
                        </label>
                    </div>

                    {mutation.isError && (
                        <Alert severity="error" sx={{ mt: 2 }}>{mutation.error.message}</Alert>
                    )}

                    <div className={styles.footer}>
                        <button type="button" className={styles.cancelBtn} onClick={() => navigate("/spaces")}>
                            Cancelar
                        </button>
                        <button type="submit" className={styles.saveBtn} disabled={mutation.isPending}>
                            {mutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Modal for adding Availability */}
            {showAddAvailModal && (
                <div className={styles.overlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h2>Agregar Horario</h2>
                        </div>
                        <div className={styles.modalContent}>
                            <div className={styles.formGroup}>
                                <label>Días de la semana <span className={styles.requiredStar}>*</span></label>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                                    {[
                                        { id: 'MONDAY', label: 'L' },
                                        { id: 'TUESDAY', label: 'M' },
                                        { id: 'WEDNESDAY', label: 'M' },
                                        { id: 'THURSDAY', label: 'J' },
                                        { id: 'FRIDAY', label: 'V' },
                                        { id: 'SATURDAY', label: 'S' },
                                        { id: 'SUNDAY', label: 'D' }
                                    ].map(day => (
                                        <button
                                            key={day.id}
                                            type="button"
                                            onClick={() => toggleDay(day.id)}
                                            style={{
                                                width: '36px',
                                                height: '36px',
                                                borderRadius: '50%',
                                                border: '1px solid #e5e7eb',
                                                backgroundColor: selectedDays.includes(day.id) ? '#6B5B95' : 'white',
                                                color: selectedDays.includes(day.id) ? 'white' : '#6b7280',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 'bold',
                                                fontSize: '14px',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {day.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label style={{ marginBottom: '-6px' }}>Horario <span className={styles.requiredStar}>*</span></label>
                                <span style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '8px' }}>Hora inicio y hora de fin</span>
                                <div className={styles.formRow}>
                                    <input type="time" value={newAvailStartTime} onChange={(e) => setNewAvailStartTime(e.target.value)} style={{ flex: 1 }} />
                                    <input type="time" value={newAvailEndTime} onChange={(e) => setNewAvailEndTime(e.target.value)} style={{ flex: 1 }} />
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button type="button" className={styles.cancelBtn} onClick={() => setShowAddAvailModal(false)}>Cancelar</button>
                            <button type="button" className={styles.submitAvailButton} onClick={handleAddAvailability} disabled={selectedDays.length === 0 || !newAvailStartTime || !newAvailEndTime}>
                                ✓ Agregar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EditSpace;
