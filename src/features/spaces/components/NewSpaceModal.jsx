import { useState } from 'react';
import styles from './NewSpaceModal.module.css';
import { FiX, FiPlus } from 'react-icons/fi';
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

    const [alertInfo, setAlertInfo] = useState(null);
    const [errors, setErrors] = useState({});

    const queryClient = useQueryClient();

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
        mutationFn: (data) => apiFetch("/spacetypes", {
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
        onSuccess: () => {
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

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setAlertInfo({ type: 'error', text: 'Todos los campos marcados con un asterisco son obligatorios' });
            return;
        }

        setErrors({});
        setAlertInfo(null);

        mutationSpace.mutate({
            status: "AVAILABLE",
            name: spaceName,
            description: spaceDescription,
            studentsAvailable: !spaceRestricted,
            buildingId: parseInt(spaceBuilding) || 0,
            availability: [],
            exceptions: [],
            spaceTypeId: parseInt(spaceType) || 0,
            bookInAdvanceDuration: "PT24H",
            capacity: parseInt(spaceCapacity) || 0
        });
    };

    return (
        <div className={styles.overlay}>

            <div className={styles.modal}>

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
                                    {b_types?.map((type) => (
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
                                        {b_buildings?.map((building) => (
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
                            <input type="number" placeholder="Ej. 200" value={spaceCapacity} onChange={(e) => setSpaceCapacity(e.target.value)} />
                            {errors.spaceCapacity && <span className={styles.errorText}>{errors.spaceCapacity}</span>}
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Descripción</label>
                        <textarea placeholder="Descripción del espacio..." value={spaceDescription} onChange={(e) => setSpaceDescription(e.target.value)}></textarea>
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
        </div>
    );
};