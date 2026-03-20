import { useState } from "react";
import { FiX, FiPlus } from "react-icons/fi";
import styles from "./NewEquipmentModal.module.css";
import { Alert } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../../api/client";

export const NewEquipmentModal = ({ onClose }) => {
    const [name, setName] = useState("");
    const [equipmentTypeId, setEquipmentTypeId] = useState("");
    const [inventoryNum, setInventoryNum] = useState("");
    const [status, setStatus] = useState("AVAILABLE");
    const [spaceId, setSpaceId] = useState("");
    const [description, setDescription] = useState("");
    const [restricted, setRestricted] = useState(false);

    const [showAddTypeModal, setShowAddTypeModal] = useState(false);
    const [newTypeName, setNewTypeName] = useState("");
    const [newTypeDescription, setNewTypeDescription] = useState("");

    const [alertInfo, setAlertInfo] = useState(null);
    const [errors, setErrors] = useState({});

    const queryClient = useQueryClient();

    const { data: b_spaces } = useQuery({
        queryKey: ["getAllSpacesOptions"],
        queryFn: () => apiFetch("/spaces", { method: "GET" })
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

    const handleRegister = () => {
        let newErrors = {};

        if (!name.trim()) newErrors.name = "Este campo es obligatorio";
        if (!equipmentTypeId) newErrors.equipmentTypeId = "Este campo es obligatorio";
        if (!inventoryNum.trim()) newErrors.inventoryNum = "Este campo es obligatorio";
        if (!status) newErrors.status = "Este campo es obligatorio";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setAlertInfo({ type: 'error', text: 'Complete los campos obligatorios' });
            return;
        }

        setErrors({});
        setAlertInfo(null);

        mutationEquipment.mutate({
            status: status,
            name: name.trim(),
            description: description.trim(),
            studentsAvailable: !restricted,
            buildingId: null,
            availability: [],
            exceptions: [],
            inventoryNum: inventoryNum.trim(),
            spaceId: spaceId ? parseInt(spaceId) : null,
            equipmentTypeId: equipmentTypeId ? parseInt(equipmentTypeId) : null
        });
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal} style={{ maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
                <div className={styles.header}>
                    <h2>Registro de equipo</h2>
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
                            <label>Estado inicial <span className={styles.requiredStar}>*</span></label>
                            <div className={styles.selectWrapper}>
                                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option value="" disabled>Seleccione...</option>
                                    <option value="AVAILABLE">Disponible</option>
                                    <option value="MAINTENANCE">Mantenimiento</option>
                                    <option value="DAMAGED">Dañado</option>
                                </select>
                            </div>
                            {errors.status && <span className={styles.errorText}>{errors.status}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label>Espacio Asociado (Opcional)</label>
                            <div className={styles.selectWrapper}>
                                <select value={spaceId} onChange={(e) => setSpaceId(e.target.value)}>
                                    <option value="">Ninguno</option>
                                    {b_spaces?.content?.map((space) => (
                                        <option key={space.id} value={space.id}>
                                            {space.name} ({space.building?.name})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Descripción</label>
                        <textarea placeholder="Descripción del equipo..." value={description} onChange={(e) => setDescription(e.target.value)} style={{ minHeight: '80px' }}></textarea>
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
        </div>
    );
};

export default NewEquipmentModal;