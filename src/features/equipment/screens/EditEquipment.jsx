import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../../api/client";
import { FiArrowLeft, FiPlus, FiTrash2 } from "react-icons/fi";
import LoaderCircle from "../../../assets/components/LoaderCircle";
import { Alert, Snackbar } from "@mui/material";
import styles from "../styles/EditEquipment.module.css";

function EditEquipment() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [successMessage, setSuccessMessage] = useState("");

    const [showAddAvailModal, setShowAddAvailModal] = useState(false);
    const [selectedDays, setSelectedDays] = useState([]);
    const [newAvailStartTime, setNewAvailStartTime] = useState("");
    const [newAvailEndTime, setNewAvailEndTime] = useState("");

    const dayMapping = {
        MONDAY: "Lunes",
        TUESDAY: "Martes",
        WEDNESDAY: "Miércoles",
        THURSDAY: "Jueves",
        FRIDAY: "Viernes",
        SATURDAY: "Sábado",
        SUNDAY: "Domingo"
    };

    const [formData, setFormData] = useState({
        name: "",
        typeId: "",
        bookInAdvanceDuration: "",
        advanceUnit: "HOURS",
        status: "",
        inventoryIdNum: "",
        description: "",
        availableForStudents: true,
        buildingId: "",
        availabilitySlots: []
    });

    const { data: equipment, isPending } = useQuery({
        queryKey: ["GetEquipmentForEdit", id],
        queryFn: () => apiFetch(`/equipments/${id}`, { method: "GET" }),
    });

    const { data: types } = useQuery({
        queryKey: ["GetEquipmentTypes"],
        queryFn: () => apiFetch("/equipment-types", { method: "GET" }),
    });

    const { data: buildings } = useQuery({
        queryKey: ["buildings"],
        queryFn: () => apiFetch("/buildings", { method: "GET" }),
    });

    useEffect(() => {
        if (equipment) {
            console.log("Equipment data loaded:", equipment);
            let durationPart = "";
            let unitPart = "HOURS";

            if (equipment.bookInAdvanceDuration) {
                const dur = equipment.bookInAdvanceDuration;
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
                name: equipment.name,
                typeId: equipment.type?.id || "",
                buildingId: equipment.building?.id || "",
                bookInAdvanceDuration: durationPart,
                advanceUnit: unitPart,
                status: equipment.status === 'IN_USE' ? 'LOANED' : (equipment.status || "AVAILABLE"),
                inventoryIdNum: equipment.inventoryIdNum,
                description: equipment.description,
                availableForStudents: equipment.availableForStudents,
                availabilitySlots: equipment.availabilitySlots || []
            });
        }
    }, [equipment]);

    const mutation = useMutation({
        mutationFn: (updatedData) => apiFetch(`/equipments/${id}`, {
            method: "PUT",
            body: JSON.stringify(updatedData)
        }),
        onSuccess: () => {
            queryClient.invalidateQueries(["GetEquipmentForEdit", id]);
            queryClient.invalidateQueries(["GetEquipments"]);
            setSuccessMessage("Equipo actualizado correctamente");
            setTimeout(() => navigate("/equipment"), 1500);
        }
    });

    const handleAddAvailability = () => {
        if (selectedDays.length === 0 || !newAvailStartTime || !newAvailEndTime) return;
        
        // Validation: Start time must be before end time
        if (newAvailStartTime >= newAvailEndTime) {
            alert("La hora de inicio debe ser anterior a la hora de fin");
            return;
        }

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

        // Normalize availability slots (ensure HH:mm format and filter invalid ones)
        const normalizedAvailability = (formData.availabilitySlots || [])
            .filter(slot => slot.startTime < slot.endTime)
            .map(slot => ({
                ...slot,
                startTime: slot.startTime.substring(0, 5),
                endTime: slot.endTime.substring(0, 5)
            }));

        const payload = {
            name: formData.name.trim(),
            description: formData.description.trim(),
            status: formData.status,
            studentsAvailable: formData.availableForStudents,
            availableForStudents: formData.availableForStudents,
            inventoryNum: formData.inventoryIdNum,
            bookInAdvanceDuration: bookInAdvanceDurationFormatted,
            equipmentTypeId: parseInt(formData.typeId) || equipment?.type?.id || 0,
            buildingId: parseInt(formData.buildingId) || equipment?.building?.id || 0,
            availability: normalizedAvailability,
            exceptions: equipment?.exceptions || [],
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
                    <h1>Equipos</h1>
                </div>
            </div>

            <button className={styles.backButton} onClick={() => navigate("/equipment")}>
                <FiArrowLeft /> Volver
            </button>

            <div className={styles.mainCard}>
                <div className={styles.cardHeader}>
                    <h2>Editar {formData.name}</h2>
                </div>

                <form className={styles.cardContent} onSubmit={handleSubmit}>
                    <div className={styles.formGrid}>
                        {/* Row 1 */}
                        <div className={styles.formGroup}>
                            <label>Nombre del equipo <span className={styles.requiredStar}>*</span></label>
                            <input name="name" value={formData.name} onChange={handleChange} required />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Ubicación <span className={styles.requiredStar}>*</span></label>
                            <select name="buildingId" value={formData.buildingId} onChange={handleChange} required>
                                <option value="">Seleccionar edificio</option>
                                {buildings?.filter(b => b.deletedAt === null).map(b => (
                                    <option key={b.id} value={b.id}>{b.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Tipo <span className={styles.requiredStar}>*</span></label>
                            <select name="typeId" value={formData.typeId} onChange={handleChange} required>
                                <option value="">Seleccionar tipo</option>
                                {types?.filter(t => t.deletedAt === null).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Tiempo de anticipación <span className={styles.requiredStar}>*</span></label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input style={{ flex: 1.5 }} type="number" name="bookInAdvanceDuration" value={formData.bookInAdvanceDuration} onChange={handleChange} required />
                                <select style={{ flex: 1 }} name="advanceUnit" value={formData.advanceUnit} onChange={handleChange}>
                                    <option value="MINUTES">Minutos</option>
                                    <option value="HOURS">Horas</option>
                                    <option value="DAYS">Días</option>
                                </select>
                            </div>
                        </div>

                        {/* Row 2 */}
                        <div className={styles.formGroup}>
                            <label>Estado inicial <span className={styles.requiredStar}>*</span></label>
                            <select name="status" value={formData.status} onChange={handleChange} required>
                                <option value="AVAILABLE">Disponible</option>
                                <option value="LOANED">En Uso</option>
                                <option value="MAINTENANCE">Mantenimiento</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Nº inventario <span className={styles.requiredStar}>*</span></label>
                            <input name="inventoryIdNum" value={formData.inventoryIdNum} onChange={handleChange} required />
                        </div>

                        <div className={`${styles.formGroup} ${styles.scheduleCol}`}>
                            <div className={styles.scheduleSection}>
                                <div className={styles.scheduleHeader}>
                                    <h3>Horarios configurados</h3>
                                    <button type="button" className={styles.addButton} onClick={() => setShowAddAvailModal(true)}>
                                        <FiPlus /> Agregar
                                    </button>
                                </div>
                                {formData.availabilitySlots?.map((slot, i) => (
                                    <div key={i} className={styles.scheduleItem}>
                                        <div>
                                            <div className={styles.dayLabel}>{slot.daysOfWeek.map(d => dayMapping[d] || d).join(", ")}</div>
                                            <div className={styles.timeLabel}>{slot.startTime} - {slot.endTime}</div>
                                        </div>
                                        <button type="button" className={styles.deleteBtn} onClick={() => removeAvailability(i)}>
                                            <FiTrash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Row 3 */}
                        <div className={`${styles.formGroup} ${styles.twoThirds}`}>
                            <label>Descripción</label>
                            <textarea name="description" rows="4" value={formData.description} onChange={handleChange} placeholder="Describa el equipo..." />
                        </div>
                    </div>

                    <div className={styles.bottomSection}>
                        <div className={styles.restrictionBox}>
                            <span className={styles.restrictionLabel}>Restringido para estudiantes</span>
                            <label className={styles.switch}>
                                <input
                                    type="checkbox"
                                    checked={!formData.availableForStudents}
                                    onChange={(e) => setFormData(prev => ({ ...prev, availableForStudents: !e.target.checked }))}
                                />
                                <span className={styles.slider}></span>
                            </label>
                        </div>

                        {mutation.isError && <Alert severity="error" sx={{ mb: 2 }}>{mutation.error.message}</Alert>}

                        <div className={styles.footerButtons}>
                            <button type="button" className={styles.cancelBtn} onClick={() => navigate("/equipment")}>Cancelar</button>
                            <button type="submit" className={styles.saveBtn} disabled={mutation.isPending}>
                                {mutation.isPending ? "Guardando..." : "Guardar Cambios"}
                            </button>
                        </div>
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

export default EditEquipment;
