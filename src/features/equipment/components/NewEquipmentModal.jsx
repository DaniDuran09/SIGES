import { useState } from "react";
import { FiX, FiPlus, FiCalendar, FiTrash2 } from "react-icons/fi";
import styles from "./NewEquipmentModal.module.css";
import { Alert } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../../api/client";

export const NewEquipmentModal = ({ onClose }) => {
    const [name, setName] = useState("");
    const [equipmentTypeId, setEquipmentTypeId] = useState("");
    const [inventoryNum, setInventoryNum] = useState("");
    const [status, setStatus] = useState("AVAILABLE");
    const [buildingId, setBuildingId] = useState("");
    const [advanceTime, setAdvanceTime] = useState("");
    const [advanceUnit, setAdvanceUnit] = useState("");
    const [description, setDescription] = useState("");
    const [restricted, setRestricted] = useState(false);

    const [showAddTypeModal, setShowAddTypeModal] = useState(false);
    const [newTypeName, setNewTypeName] = useState("");
    const [newTypeDescription, setNewTypeDescription] = useState("");

    const [availability, setAvailability] = useState([]);
    const [showAddAvailModal, setShowAddAvailModal] = useState(false);
    const [newAvailDay, setNewAvailDay] = useState("");
    const [newAvailStartTime, setNewAvailStartTime] = useState("");
    const [newAvailEndTime, setNewAvailEndTime] = useState("");

    const [alertInfo, setAlertInfo] = useState(null);
    const [errors, setErrors] = useState({});

    const queryClient = useQueryClient();

    const { data: b_buildings } = useQuery({
        queryKey: ["getAllBuildingsForEquip"],
        queryFn: () => apiFetch("/buildings", { method: "GET" })
    });

    const { data: b_equipmentTypes } = useQuery({
        queryKey: ["getEquipmentTypes"],
        queryFn: () => apiFetch("/equipment-types", { method: "GET" })
    });

    const mutationType = useMutation({
        mutationFn: (data) => apiFetch("/equipment-types", {
            method: "POST",
            body: JSON.stringify(data),
        }),
        onSuccess: () => {
            setShowAddTypeModal(false);
            setNewTypeName("");
            setNewTypeDescription("");
            queryClient.invalidateQueries({ queryKey: ["getEquipmentTypes"] });
        },
        onError: (error) => {
            console.log("Error", error.message);
        }
    });

    const handleAddType = () => {
        if (!newTypeName.trim()) return;
        mutationType.mutate({
            name: newTypeName,
            description: newTypeDescription
        });
    };

    const mutationEquipment = useMutation({
        mutationFn: (data) => apiFetch("/equipments", {
            method: "POST",
            body: JSON.stringify(data),
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["GetEquipments"] });
            setAlertInfo({ type: 'success', text: 'Equipo registrado correctamente' });
            setTimeout(() => {
                onClose();
            }, 2000);
        },
        onError: (error) => {
            console.log("Error", error.message);
            setAlertInfo({ type: 'error', text: error.message || 'Error al registrar el equipo' });
        }
    });

    const handleAddAvailability = () => {
        if (!newAvailDay || !newAvailStartTime || !newAvailEndTime) return;
        const newItem = {
            dateFrom: new Date().toISOString().split('T')[0],
            dateTo: new Date().toISOString().split('T')[0],
            startTime: newAvailStartTime,
            endTime: newAvailEndTime,
            daysOfWeek: [newAvailDay]
        };
        setAvailability([...availability, newItem]);
        setShowAddAvailModal(false);
        setNewAvailDay("");
        setNewAvailStartTime("");
        setNewAvailEndTime("");
    };

    const removeAvailability = (index) => {
        setAvailability(availability.filter((_, i) => i !== index));
    };

    const dayMapping = {
        MONDAY: "Lunes",
        TUESDAY: "Martes",
        WEDNESDAY: "Miércoles",
        THURSDAY: "Jueves",
        FRIDAY: "Viernes",
        SATURDAY: "Sábado",
        SUNDAY: "Domingo"
    };

    const formatTime = (timeStr) => {
        const [h, m] = timeStr.split(':');
        const hour = parseInt(h, 10);
        const ampm = hour >= 12 ? 'p.m' : 'a.m';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour.toString().padStart(2, '0')}:${m} ${ampm}`;
    };

    const handleRegister = () => {
        let newErrors = {};

        if (!name.trim()) newErrors.name = "Este campo es obligatorio";
        if (!equipmentTypeId) newErrors.equipmentTypeId = "Este campo es obligatorio";
        if (!inventoryNum.trim()) newErrors.inventoryNum = "Este campo es obligatorio";
        if (!status) newErrors.status = "Este campo es obligatorio";
        if (!buildingId) newErrors.buildingId = "Debe elegir un edificio base";
        if (!advanceTime.trim()) newErrors.advanceTime = "Este campo es obligatorio";
        if (!advanceUnit) newErrors.advanceUnit = "Este campo es obligatorio";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setAlertInfo({ type: 'error', text: 'Complete los campos obligatorios' });
            return;
        }

        setErrors({});
        setAlertInfo(null);

        let bookInAdvanceDuration = "";
        if (advanceUnit === "MINUTES") bookInAdvanceDuration = `PT${advanceTime}M`;
        else if (advanceUnit === "HOURS") bookInAdvanceDuration = `PT${advanceTime}H`;
        else if (advanceUnit === "DAYS") bookInAdvanceDuration = `P${advanceTime}D`;

        const payload = {
            status: status,
            name: name.trim(),
            description: description.trim(),
            studentsAvailable: !restricted,
            availability: availability,
            exceptions: [],
            inventoryNum: inventoryNum.trim(),
            bookInAdvanceDuration: bookInAdvanceDuration,
            equipmentTypeId: parseInt(equipmentTypeId),
            buildingId: parseInt(buildingId)
        };

        mutationEquipment.mutate(payload);
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal} style={{ maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto' }}>
                <div className={styles.header}>
                    <h2>Registro de equipos</h2>
                    <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Cerrar modal">
                        <FiX size={20} />
                    </button>
                </div>

                {alertInfo && (
                    <Alert severity={alertInfo.type} style={{ margin: '10px 20px 0 20px' }}>
                        {alertInfo.text}
                    </Alert>
                )}

                <div className={styles.content} style={{ marginTop: alertInfo ? '16px' : '0' }}>
                    <div className={styles.twoColumnLayout}>
                        {/* Left Column: Register Form */}
                        <div className={styles.leftColumn}>
                            <div className={styles.formGroup}>
                                <label>Nombre del equipo <span className={styles.requiredStar}>*</span></label>
                                <input type="text" placeholder="Ej. Proyector HDMI" value={name} onChange={(e) => setName(e.target.value)} />
                                {errors.name && <span className={styles.errorText}>{errors.name}</span>}
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Tipo <span className={styles.requiredStar}>*</span></label>
                                    <div className={styles.inputWithButton}>
                                        <div className={styles.selectWrapper} style={{ flex: 1 }}>
                                            <select value={equipmentTypeId} onChange={(e) => setEquipmentTypeId(e.target.value)}>
                                                <option value="" disabled>Seleccione...</option>
                                                {b_equipmentTypes?.map((eqType) => (
                                                    <option key={eqType.id} value={eqType.id}>
                                                        {eqType.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <button type="button" className={styles.plusButton} onClick={() => setShowAddTypeModal(true)}>
                                            <FiPlus size={20} />
                                        </button>
                                    </div>
                                    {errors.equipmentTypeId && <span className={styles.errorText}>{errors.equipmentTypeId}</span>}
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Nº inventario <span className={styles.requiredStar}>*</span></label>
                                    <input type="text" placeholder="Ej. INV-2026-000" value={inventoryNum} onChange={(e) => setInventoryNum(e.target.value)} />
                                    {errors.inventoryNum && <span className={styles.errorText}>{errors.inventoryNum}</span>}
                                </div>
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Edificio (Ubicación) <span className={styles.requiredStar}>*</span></label>
                                    <div className={styles.selectWrapper}>
                                        <select value={buildingId} onChange={(e) => setBuildingId(e.target.value)}>
                                            <option value="" disabled>Seleccione...</option>
                                            {b_buildings?.map((b) => (
                                                <option key={b.id} value={b.id}>
                                                    {b.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.buildingId && <span className={styles.errorText}>{errors.buildingId}</span>}
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Estado inicial <span className={styles.requiredStar}>*</span></label>
                                    <div className={styles.selectWrapper}>
                                        <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                            <option value="" disabled>Seleccione...</option>
                                            <option value="AVAILABLE">Disponible</option>
                                            <option value="MAINTENANCE">Mantenimiento</option>
                                            <option value="IN_USE">En uso</option>
                                        </select>
                                    </div>
                                    {errors.status && <span className={styles.errorText}>{errors.status}</span>}
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Tiempo de anticipación <span className={styles.requiredStar}>*</span></label>
                                <div className={styles.formRow}>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <input type="number" placeholder="Cantidad" value={advanceTime} onChange={(e) => setAdvanceTime(e.target.value)} />
                                    </div>
                                    <div className={styles.selectWrapper} style={{ flex: 1 }}>
                                        <select value={advanceUnit} onChange={(e) => setAdvanceUnit(e.target.value)}>
                                            <option value="" disabled>Tiempo</option>
                                            <option value="MINUTES">Minutos</option>
                                            <option value="HOURS">Horas</option>
                                            <option value="DAYS">Días</option>
                                        </select>
                                    </div>
                                </div>
                                {(errors.advanceTime || errors.advanceUnit) && <span className={styles.errorText}>Complete ambos campos</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <label>Descripción</label>
                                <textarea placeholder="Descripción del equipo..." value={description} onChange={(e) => setDescription(e.target.value)} style={{ minHeight: '80px', resize: 'vertical' }}></textarea>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Restricción</label>
                                <div className={styles.toggleContainer}>
                                    <span>Restringido para estudiantes</span>
                                    <label className={styles.switch}>
                                        <input type="checkbox" checked={restricted} onChange={(e) => setRestricted(e.target.checked)} />
                                        <span className={styles.slider}></span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Availability */}
                        <div className={styles.rightColumn}>
                            <div className={styles.rightHeader}>
                                <h3>Disponibilidad de horarios</h3>
                                <button type="button" className={styles.addButton} onClick={() => setShowAddAvailModal(true)}>
                                    <FiPlus size={16} /> Agregar
                                </button>
                            </div>

                            {availability.length === 0 ? (
                                <div className={styles.emptySchedule}>
                                    <FiCalendar size={32} />
                                    <p>No hay horarios configurados</p>
                                    <span>Haz clic en "Agregar" para definir la disponibilidad</span>
                                </div>
                            ) : (
                                <div className={styles.scheduleList}>
                                    {availability.map((item, index) => (
                                        <div key={index} className={styles.scheduleItem}>
                                            <div className={styles.scheduleItemInfo}>
                                                <h4>{dayMapping[item.daysOfWeek[0]] || item.daysOfWeek[0]}</h4>
                                                <p>{formatTime(item.startTime)} - {formatTime(item.endTime)}</p>
                                            </div>
                                            <button type="button" className={styles.trashBtn} onClick={() => removeAvailability(index)}>
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.footer}>
                    <button type="button" className={styles.cancelButton} onClick={onClose} disabled={mutationEquipment.isPending}>
                        Cancelar
                    </button>
                    <button
                        type="button"
                        className={styles.submitButton}
                        onClick={handleRegister}
                        disabled={mutationEquipment.isPending}
                    >
                        {mutationEquipment.isPending ? "Registrando..." : "Registrar Equipo"}
                    </button>
                </div>
            </div>

            {/* Modal for adding Type */}
            {showAddTypeModal && (
                <div className={styles.overlay} style={{ zIndex: 10000 }}>
                    <div className={styles.modal} style={{ maxWidth: '400px' }}>
                        <div className={styles.header}>
                            <h2>Nuevo tipo</h2>
                            <button type="button" className={styles.closeButton} onClick={() => setShowAddTypeModal(false)}>
                                <FiX size={20} />
                            </button>
                        </div>
                        <div className={styles.content}>
                            <div className={styles.formGroup}>
                                <label>Nombre <span className={styles.requiredStar}>*</span></label>
                                <input type="text" placeholder="Ej. Proyector" value={newTypeName} onChange={(e) => setNewTypeName(e.target.value)} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Descripción</label>
                                <textarea placeholder="Ej. Equipo de proyección visual..." value={newTypeDescription} onChange={(e) => setNewTypeDescription(e.target.value)} style={{ padding: '12px 14px', height: '80px', fontFamily: 'inherit', resize: 'vertical' }}></textarea>
                            </div>
                        </div>
                        <div className={styles.footer}>
                            <button type="button" className={styles.cancelButton} onClick={() => setShowAddTypeModal(false)}>Cancelar</button>
                            <button type="button" className={styles.submitButton} onClick={handleAddType} disabled={mutationType.isPending || !newTypeName.trim()}>
                                {mutationType.isPending ? "Agregando..." : "Agregar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for adding Availability */}
            {showAddAvailModal && (
                <div className={styles.overlay} style={{ zIndex: 10000 }}>
                    <div className={styles.modal} style={{ maxWidth: '420px', paddingBottom: '12px' }}>
                        <div className={styles.header}>
                            <h2>Agregar Horario</h2>
                        </div>
                        <div className={styles.content}>
                            <div className={styles.formGroup}>
                                <label>Día de la semana <span className={styles.requiredStar}>*</span></label>
                                <div className={styles.selectWrapper}>
                                    <select value={newAvailDay} onChange={(e) => setNewAvailDay(e.target.value)}>
                                        <option value="" disabled>Seleccione un día</option>
                                        <option value="MONDAY">Lunes</option>
                                        <option value="TUESDAY">Martes</option>
                                        <option value="WEDNESDAY">Miércoles</option>
                                        <option value="THURSDAY">Jueves</option>
                                        <option value="FRIDAY">Viernes</option>
                                        <option value="SATURDAY">Sábado</option>
                                        <option value="SUNDAY">Domingo</option>
                                    </select>
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
                        <div className={styles.footer} style={{ justifyContent: 'center' }}>
                            <button type="button" className={styles.cancelButton} onClick={() => setShowAddAvailModal(false)}>Cancelar</button>
                            <button type="button" className={styles.submitAvailButton} onClick={handleAddAvailability} disabled={!newAvailDay || !newAvailStartTime || !newAvailEndTime}>
                                ✓ Agregar
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default NewEquipmentModal;