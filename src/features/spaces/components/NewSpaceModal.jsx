import { useState } from 'react';
import styles from './NewSpaceModal.module.css';
import { FiX } from 'react-icons/fi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../../../api/client';
import { Alert } from '@mui/material';

export const NewSpaceModal = ({ onClose }) => {
    const [showAddType, setShowAddType] = useState(false);
    const [showAddBuilding, setShowAddBuilding] = useState(false);
    const [newBuildingName, setNewBuildingName] = useState("");

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
                        <input type="text" placeholder="Ej. Auditorio Principal" />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Tipo</label>
                        <div className={styles.selectWrapper}>
                            <select defaultValue="">
                                <option value="" disabled>Seleccione...</option>
                                {b_types?.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                                <option value="">Agregar tipo</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Ubicación</label>
                            <select>
                                <option onClick={() => { setShowAddBuilding(false) }} value="">Seleccione...</option>
                                {b_buildings?.map((building) => (
                                    <option onClick={() => { setShowAddBuilding(false) }} key={building.id} value={building.id}>
                                        {building.name}
                                    </option>
                                ))}
                                <option onClick={() => { setShowAddBuilding(true) }} value="">Agregar ubicación</option>
                            </select>
                            {showAddBuilding && (
                                <div style={{ marginTop: "10px", backgroundColor: "#D8D3E4", padding: "10px", borderRadius: "5px" }} className={styles.formGroup}>
                                    <label  >Nueva ubicación</label>
                                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                                        <input style={{ backgroundColor: "#fff", color: "#000" }} type="text" placeholder="Ej. Edificio A" value={newBuildingName} onChange={(e) => setNewBuildingName(e.target.value)} />
                                        <button style={{ backgroundColor: "#D4F1E8", color: "#1aa76fff", padding: "5px 10px", borderRadius: "5px" }} onClick={handleAddBuilding}>Agregar</button>
                                        <button style={{ backgroundColor: "#fff", color: "#000000ff", padding: "5px 25px", borderRadius: "5px" }} onClick={() => { setShowAddBuilding(false) }} >X</button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className={styles.formGroup}>
                            <label>Capacidad</label>
                            <input type="number" placeholder="Ej. 200" />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Descripción</label>
                        <textarea placeholder="Descripción del espacio..."></textarea>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Restricción</label>
                        <div className={styles.toggleContainer}>
                            <span>Restringido para estudiantes</span>
                            <label className={styles.switch}>
                                <input type="checkbox" defaultChecked />
                                <span className={styles.slider}></span>
                            </label>
                        </div>
                    </div>

                </div>

                <div className={styles.footer}>
                    <button className={styles.cancelButton} onClick={onClose}>
                        Cancelar
                    </button>
                    <button className={styles.submitButton}>
                        Registrar Espacio
                    </button>
                </div>

            </div>
        </div>
    );
};