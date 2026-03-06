import { useState } from 'react';
import styles from './NewSpaceModal.module.css';
import { FiX } from 'react-icons/fi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../../../api/client';
import { Alert } from '@mui/material';

export const NewSpaceModal = ({ onClose }) => {
    const [showAddType, setShowAddType] = useState(false);
    const [newTypeName, setNewTypeName] = useState("");
    const [newTypeDescription, setNewTypeDescription] = useState("");
    const [showAddBuilding, setShowAddBuilding] = useState(false);
    const [newBuildingName, setNewBuildingName] = useState("");

    const [spaceName, setSpaceName] = useState("");
    const [spaceType, setSpaceType] = useState("");
    const [spaceBuilding, setSpaceBuilding] = useState("");
    const [spaceCapacity, setSpaceCapacity] = useState("");
    const [spaceDescription, setSpaceDescription] = useState("");
    const [spaceRestricted, setSpaceRestricted] = useState(true);

    const queryClient = useQueryClient();

    const { data: b_types, isLoading: b_typesLoading, error: b_typesError } = useQuery({
        queryKey: ["getSpaceTypes"],
        queryFn: () => apiFetch("/spacetypes", {
            method: "GET",
        })
    })

    const { data: b_buildings, isLoading: b_buildingsLoading, error: b_buildingsError } = useQuery({
        queryKey: ["getBuildings"],
        queryFn: () => apiFetch("/buildings", {
            method: "GET",
        })
    })

    const mutationType = useMutation({
        mutationFn: (data) => apiFetch("/spacetypes", {
            method: "POST",
            body: JSON.stringify(data),
        }),
        onSuccess: () => {
            setShowAddType(false)
            setNewTypeName("")
            setNewTypeDescription("")
            queryClient.invalidateQueries({ queryKey: ["getSpaceTypes"] });
        },
        onError: (error) => {
            console.log("Error", error.message);
        }
    })

    const handleAddType = () => {
        mutationType.mutate({
            name: newTypeName,
            description: newTypeDescription,
        })
    }

    const mutationBuilding = useMutation({
        mutationFn: (data) => apiFetch("/buildings", {
            method: "POST",
            body: JSON.stringify(data),
        }),
        onSuccess: () => {
            setShowAddBuilding(false)
            queryClient.invalidateQueries({ queryKey: ["getBuildings"] });
        },
        onError: (error) => {
            console.log("Error", error.message);
        }
    })

    const handleAddBuilding = () => {
        mutationBuilding.mutate({
            name: newBuildingName,
        })
    }

    const mutationSpace = useMutation({
        mutationFn: (data) => apiFetch("/spaces", {
            method: "POST",
            body: JSON.stringify(data),
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["GetSpaces"] });
            onClose();
        },
        onError: (error) => {
            console.log("Error", error.message);
        }
    });

    const handleAddSpace = () => {

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
                    <button className={styles.closeButton} onClick={onClose} aria-label="Cerrar modal">
                        <FiX size={20} />
                    </button>
                </div>

                <div className={styles.content}>

                    <div className={styles.formGroup}>
                        <label>Nombre del espacio</label>
                        <input type="text" placeholder="Ej. Auditorio Principal" value={spaceName} onChange={(e) => setSpaceName(e.target.value)} />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Tipo</label>
                        <div className={styles.selectWrapper}>
                            <select value={spaceType} onChange={(e) => {
                                if (e.target.value === "add_type") {
                                    setShowAddType(true);
                                } else {
                                    setSpaceType(e.target.value);
                                    setShowAddType(false);
                                }
                            }}>
                                <option value="" disabled>Seleccione...</option>
                                {b_types?.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                                <option value="add_type">Agregar tipo</option>
                            </select>
                        </div>
                        {showAddType && (
                            <div className={styles.addSubForm}>
                                <span className={styles.addSubFormTitle}>Nuevo tipo</span>
                                <div className={styles.addSubFormCol}>
                                    <input type="text" placeholder="Ej. Aula" value={newTypeName} onChange={(e) => setNewTypeName(e.target.value)} />
                                    <input type="text" placeholder="Ej. Salón de clases útil para presentaciones..." value={newTypeDescription} onChange={(e) => setNewTypeDescription(e.target.value)} />
                                    <div className={styles.addSubFormActions}>
                                        <button className={styles.btnAdd} onClick={handleAddType} disabled={mutationType.isPending}>
                                            {mutationType.isPending ? "Cargando..." : "Agregar"}
                                        </button>
                                        <button className={styles.btnDismiss} onClick={() => { setShowAddType(false); setNewTypeName(""); setNewTypeDescription(""); }}>X</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Ubicación</label>
                            <select value={spaceBuilding} onChange={(e) => {
                                if (e.target.value === "add_building") {
                                    setShowAddBuilding(true);
                                } else {
                                    setSpaceBuilding(e.target.value);
                                    setShowAddBuilding(false);
                                }
                            }}>
                                <option value="" disabled>Seleccione...</option>
                                {b_buildings?.map((building) => (
                                    <option key={building.id} value={building.id}>
                                        {building.name}
                                    </option>
                                ))}
                                <option value="add_building">Agregar ubicación</option>
                            </select>
                            {showAddBuilding && (
                                <div className={styles.addSubForm}>
                                    <span className={styles.addSubFormTitle}>Nueva ubicación</span>
                                    <div className={styles.addSubFormCol}>
                                        <input type="text" placeholder="Ej. Edificio A" value={newBuildingName} onChange={(e) => setNewBuildingName(e.target.value)} />
                                        <div className={styles.addSubFormActions}>
                                            <button className={styles.btnAdd} onClick={handleAddBuilding} disabled={mutationBuilding.isPending}>
                                                {mutationBuilding.isPending ? "Cargando..." : "Agregar"}
                                            </button>
                                            <button className={styles.btnDismiss} onClick={() => { setShowAddBuilding(false); setNewBuildingName(""); }}>X</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className={styles.formGroup}>
                            <label>Capacidad</label>
                            <input type="number" placeholder="Ej. 200" value={spaceCapacity} onChange={(e) => setSpaceCapacity(e.target.value)} />
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
                    <button className={styles.cancelButton} onClick={onClose} disabled={mutationSpace.isPending}>
                        Cancelar
                    </button>
                    <button
                        className={styles.submitButton}
                        onClick={handleAddSpace}
                        disabled={mutationSpace.isPending}
                    >
                        {mutationSpace.isPending ? "Registrando..." : "Registrar Espacio"}
                    </button>
                </div>

            </div>
        </div>
    );
};