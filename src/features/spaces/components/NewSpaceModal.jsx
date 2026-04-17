import { useState } from 'react';
import styles from './NewSpaceModal.module.css';
import { FiX, FiPlus, FiCalendar, FiTrash2 } from 'react-icons/fi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../../../api/client';
import { Alert } from '@mui/material';

export const NewSpaceModal = ({ onClose }) => {
    const [showAddTypeModal, setShowAddTypeModal] = useState(false);
    const [newTypeName, setNewTypeName] = useState("");
    const [newTypeDescription, setNewTypeDescription] = useState("");

    const [showAddBuildingModal, setShowAddBuildingModal] = useState(false);
    const [newBuildingName, setNewBuildingName] = useState("");

    const [spaceName, setSpaceName] = useState("");
    const [spaceType, setSpaceType] = useState("");
    const [spaceBuilding, setSpaceBuilding] = useState("");
    const [spaceCapacity, setSpaceCapacity] = useState("");
    const [spaceDescription, setSpaceDescription] = useState("");
    const [spaceRestricted, setSpaceRestricted] = useState(true);

    const [newEquipment, setNewEquipment] = useState("");
    const [equipmentList, setEquipmentList] = useState([]);

    const [advanceTime, setAdvanceTime] = useState("");
    const [advanceUnit, setAdvanceUnit] = useState("");

    const [availability, setAvailability] = useState([]);
    const [showAddAvailModal, setShowAddAvailModal] = useState(false);
    const [selectedDays, setSelectedDays] = useState([]);
    const [newAvailStartTime, setNewAvailStartTime] = useState("");
    const [newAvailEndTime, setNewAvailEndTime] = useState("");

    const [alertInfo, setAlertInfo] = useState(null);
    const [errors, setErrors] = useState({});

    const queryClient = useQueryClient();

    const { data: allSpaces } = useQuery({
        queryKey: ["getAllSpacesValidation"],
        queryFn: () => apiFetch("/spaces", { method: "GET" })
    });

    const { data: b_types, isLoading: b_typesLoading, error: b_typesError } = useQuery({
        queryKey: ["getSpaceTypes"],
        queryFn: () => apiFetch("/space-types", {
            method: "GET",
        })
    });

    const { data: b_buildings, isLoading: b_buildingsLoading, error: b_buildingsError } = useQuery({
        queryKey: ["getBuildings"],
        queryFn: () => apiFetch("/buildings", {
            method: "GET",
        })
    });

    const mutationType = useMutation({
        mutationFn: (data) => apiFetch("/space-types", {
            method: "POST",
            body: JSON.stringify(data),
        }),
        onSuccess: () => {
            setShowAddTypeModal(false);
            setNewTypeName("");
            setNewTypeDescription("");
            queryClient.invalidateQueries({ queryKey: ["getSpaceTypes"] });
        },
        onError: (error) => {
            console.log("Error", error.message);
        }
    });

    const handleAddType = () => {
        if (!newTypeName.trim()) return;
        mutationType.mutate({
            name: newTypeName,
            description: newTypeDescription,
        });
    };

    const mutationBuilding = useMutation({
        mutationFn: (data) => apiFetch("/buildings", {
            method: "POST",
            body: JSON.stringify(data),
        }),
        onSuccess: () => {
            setShowAddBuildingModal(false);
            setNewBuildingName("");
            queryClient.invalidateQueries({ queryKey: ["getBuildings"] });
        },
        onError: (error) => {
            console.log("Error", error.message);
        }
    });

    const handleAddBuilding = () => {
        if (!newBuildingName.trim()) return;
        mutationBuilding.mutate({
            name: newBuildingName,
        });
    };

    const mutationSpace = useMutation({
        mutationFn: (data) => apiFetch("/spaces", {
            method: "POST",
            body: JSON.stringify(data),
        }),
        onSuccess: async (data, variables) => {
            if (equipmentList.length > 0) {
                try {
                    const spacesPage = await apiFetch("/spaces?size=1000", { method: "GET" });
                    const createdSpace = spacesPage?.content?.find(s => 
                        s.name.trim().toLowerCase() === variables.name.trim().toLowerCase() &&
                        s.building?.id === variables.buildingId
                    );

                    if (createdSpace?.id) {
                        await Promise.all(equipmentList.map(eq => 
                            apiFetch(`/spaces/${createdSpace.id}/assets`, {
                                method: "POST",
                                body: JSON.stringify({
                                    name: eq,
                                    description: "",
                                    inventoryNum: "",
                                    typeId: 0
                                })
                            })
                        ));
                    }
                } catch (error) {
                    console.error("Error al registrar equipos en el espacio", error);
                }
            }
            queryClient.invalidateQueries({ queryKey: ["GetSpaces"] });
            setAlertInfo({ type: 'success', text: 'Espacio registrado exitosamente' });
            setTimeout(() => {
                onClose();
            }, 2000);
        },
        onError: (error) => {
            console.log("Error", error.message);
            setAlertInfo({ type: 'error', text: error.message || 'Error al registrar el espacio' });
        }
    });

    const handleAddEquipment = () => {
        if (newEquipment.trim() && !equipmentList.includes(newEquipment.trim())) {
            setEquipmentList([...equipmentList, newEquipment.trim()]);
            setNewEquipment("");
        }
    };

    const handleRemoveEquipment = (index) => {
        setEquipmentList(equipmentList.filter((_, i) => i !== index));
    };

    const handleAddAvailability = () => {
        if (selectedDays.length === 0 || !newAvailStartTime || !newAvailEndTime) return;
        const newItem = {
            dateFrom: new Date().toISOString().split('T')[0],
            startTime: newAvailStartTime,
            endTime: newAvailEndTime,
            daysOfWeek: selectedDays
        };
        setAvailability([...availability, newItem]);
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

    const handleAddSpace = () => {
        let newErrors = {};
        if (!spaceName.trim()) newErrors.spaceName = "Este campo es obligatorio";
        if (!spaceType) newErrors.spaceType = "Este campo es obligatorio";
        if (!spaceBuilding) newErrors.spaceBuilding = "Este campo es obligatorio";
        if (!spaceCapacity) {
            newErrors.spaceCapacity = "Este campo es obligatorio";
        } else if (parseInt(spaceCapacity) <= 0) {
            newErrors.spaceCapacity = "La capacidad debe ser mayor a 0";
        }

        if (!advanceTime.trim()) newErrors.advanceTime = "Este campo es obligatorio";
        if (!advanceUnit) newErrors.advanceUnit = "Este campo es obligatorio";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setAlertInfo({ type: 'error', text: 'Complete los campos obligatorios' });
            return;
        }

        const isDuplicate = allSpaces?.content?.some(s =>
            s.name.trim().toLowerCase() === spaceName.trim().toLowerCase() &&
            s.building?.id === parseInt(spaceBuilding)
        );

        if (isDuplicate) {
            setAlertInfo({ type: 'error', text: 'Ya existe un espacio con ese nombre en la ubicación seleccionada' });
            return;
        }

        setErrors({});
        setAlertInfo(null);

        let bookInAdvanceDuration = "PT24H";
        if (advanceUnit === "MINUTES") bookInAdvanceDuration = `PT${advanceTime}M`;
        else if (advanceUnit === "HOURS") bookInAdvanceDuration = `PT${advanceTime}H`;
        else if (advanceUnit === "DAYS") bookInAdvanceDuration = `P${advanceTime}D`;

        mutationSpace.mutate({
            status: "AVAILABLE",
            name: spaceName.trim(),
            description: spaceDescription.trim(),
            studentsAvailable: !spaceRestricted,
            availableForStudents: !spaceRestricted,
            buildingId: parseInt(spaceBuilding) || 0,
            availability: availability,
            exceptions: [],
            spaceTypeId: parseInt(spaceType) || 0,
            bookInAdvanceDuration: bookInAdvanceDuration,
            capacity: parseInt(spaceCapacity) || 0,
            equipment: equipmentList
        });
    };

    return (
        <div className={styles.overlay}>

            <div className={styles.modal} style={{ maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto' }}>

                <div className={styles.header}>
                    <h2>Registro de espacio</h2>
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
                                <label>Nombre del espacio <span className={styles.requiredStar}>*</span></label>
                                <input type="text" placeholder="Ej. Auditorio Principal" value={spaceName} onChange={(e) => setSpaceName(e.target.value)} />
                                {errors.spaceName && <span className={styles.errorText}>{errors.spaceName}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <label>Tipo <span className={styles.requiredStar}>*</span></label>
                                <div className={styles.inputWithButton}>
                                    <div className={styles.selectWrapper} style={{ flex: 1 }}>
                                        <select value={spaceType} onChange={(e) => setSpaceType(e.target.value)}>
                                            <option value="" disabled>Seleccione...</option>
                                            {b_types?.filter(t => t.deletedAt === null).map((type) => (
                                                <option key={type.id} value={type.id}>
                                                    {type.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <button type="button" className={styles.plusButton} onClick={() => setShowAddTypeModal(true)}>
                                        <FiPlus size={20} />
                                    </button>
                                </div>
                                {errors.spaceType && <span className={styles.errorText}>{errors.spaceType}</span>}
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Ubicación <span className={styles.requiredStar}>*</span></label>
                                    <div className={styles.inputWithButton}>
                                        <div className={styles.selectWrapper} style={{ flex: 1 }}>
                                            <select value={spaceBuilding} onChange={(e) => setSpaceBuilding(e.target.value)}>
                                                <option value="" disabled>Seleccione...</option>
                                                {b_buildings?.filter(b => b.deletedAt === null).map((building) => (
                                                    <option key={building.id} value={building.id}>
                                                        {building.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <button type="button" className={styles.plusButton} onClick={() => setShowAddBuildingModal(true)}>
                                            <FiPlus size={20} />
                                        </button>
                                    </div>
                                    {errors.spaceBuilding && <span className={styles.errorText}>{errors.spaceBuilding}</span>}
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Capacidad <span className={styles.requiredStar}>*</span></label>
                                    <input type="text" placeholder="Ej. 200" value={spaceCapacity} onChange={(e) => setSpaceCapacity(e.target.value.replace(/\D/g, ''))} />
                                    {errors.spaceCapacity && <span className={styles.errorText}>{errors.spaceCapacity}</span>}
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
                                <textarea placeholder="Descripción del espacio..." value={spaceDescription} onChange={(e) => setSpaceDescription(e.target.value)}></textarea>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Equipos incluidos</label>
                                <div className={styles.inputWithButton}>
                                    <input style={{ flex: 1 }} type="text" placeholder="Ej. Proyector, Pizarrón interactivo..." value={newEquipment} onChange={(e) => setNewEquipment(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddEquipment(); } }} />
                                    <button
                                        type="button"
                                        className={styles.plusButton}
                                        onClick={handleAddEquipment}
                                        disabled={!newEquipment.trim()}
                                    >
                                        <FiPlus size={20} />
                                    </button>
                                </div>
                                {equipmentList.length > 0 && (
                                    <ul className={styles.tagList}>
                                        {equipmentList.map((eq, index) => (
                                            <li key={index} className={styles.tagItem}>
                                                {eq}
                                                <button type="button" onClick={() => handleRemoveEquipment(index)}><FiX size={14} /></button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div className={styles.formGroup}>
                                <label>Restricción</label>
                                <div className={styles.toggleContainer}>
                                    <span>Restringido para estudiantes</span>
                                    <label className={styles.switch}>
                                        <input type="checkbox" checked={spaceRestricted} onChange={(e) => setSpaceRestricted(e.target.checked)} />
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
                                                <h4>{item.daysOfWeek.map(d => dayMapping[d]).join(", ")}</h4>
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
                    <button type="button" className={styles.cancelButton} onClick={onClose} disabled={mutationSpace.isPending}>
                        Cancelar
                    </button>
                    <button
                        type="button"
                        className={styles.submitButton}
                        onClick={handleAddSpace}
                        disabled={mutationSpace.isPending}
                    >
                        {mutationSpace.isPending ? "Registrando..." : "Registrar Espacio"}
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
                                <input type="text" placeholder="Ej. Aula" value={newTypeName} onChange={(e) => setNewTypeName(e.target.value)} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Descripción</label>
                                <textarea placeholder="Ej. Salón de clases útil para presentaciones..." value={newTypeDescription} onChange={(e) => setNewTypeDescription(e.target.value)} style={{ height: '80px' }}></textarea>
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

            {/* Modal for adding Building */}
            {showAddBuildingModal && (
                <div className={styles.overlay} style={{ zIndex: 10000 }}>
                    <div className={styles.modal} style={{ maxWidth: '400px' }}>
                        <div className={styles.header}>
                            <h2>Nueva ubicación</h2>
                            <button type="button" className={styles.closeButton} onClick={() => setShowAddBuildingModal(false)}>
                                <FiX size={20} />
                            </button>
                        </div>
                        <div className={styles.content}>
                            <div className={styles.formGroup}>
                                <label>Nombre <span className={styles.requiredStar}>*</span></label>
                                <input type="text" placeholder="Ej. Edificio A" value={newBuildingName} onChange={(e) => setNewBuildingName(e.target.value)} />
                            </div>
                        </div>
                        <div className={styles.footer}>
                            <button type="button" className={styles.cancelButton} onClick={() => setShowAddBuildingModal(false)}>Cancelar</button>
                            <button type="button" className={styles.submitButton} onClick={handleAddBuilding} disabled={mutationBuilding.isPending || !newBuildingName.trim()}>
                                {mutationBuilding.isPending ? "Agregando..." : "Agregar"}
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
                        <div className={styles.footer} style={{ justifyContent: 'center' }}>
                            <button type="button" className={styles.cancelButton} onClick={() => setShowAddAvailModal(false)}>Cancelar</button>
                            <button type="button" className={styles.submitAvailButton} onClick={handleAddAvailability} disabled={selectedDays.length === 0 || !newAvailStartTime || !newAvailEndTime}>
                                ✓ Agregar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};