import { useState } from "react";
import { FiX } from "react-icons/fi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../../api/client";
import { Alert } from "@mui/material";
import { FiPlus } from "react-icons/fi";
import styles from "../../equipment/components/NewEquipmentModal.module.css";

function CreateAssetModal({ onClose, onAdd }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [inventoryNum, setInventoryNum] = useState("");
    const [typeId, setTypeId] = useState("");
    const [errors, setErrors] = useState({});
    const [alertInfo, setAlertInfo] = useState(null);

    const [showAddTypeModal, setShowAddTypeModal] = useState(false);
    const [newTypeName, setNewTypeName] = useState("");
    const [newTypeDescription, setNewTypeDescription] = useState("");

    const queryClient = useQueryClient();

    const { data: equipmentTypes } = useQuery({
        queryKey: ["getEquipmentTypes"],
        queryFn: () => apiFetch("/equipment-types", { method: "GET" }),
    });

    const mutationType = useMutation({
        mutationFn: (data) => apiFetch("/equipment-types", {
            method: "POST",
            body: JSON.stringify(data),
        }),
        onSuccess: (newType) => {
            setShowAddTypeModal(false);
            setNewTypeName("");
            setNewTypeDescription("");
            queryClient.invalidateQueries({ queryKey: ["getEquipmentTypes"] });
            setTypeId(newType.id);
        },
        onError: (error) => {
            setAlertInfo({ type: "error", text: error.message || "Error al crear tipo" });
        }
    });

    const handleAddType = () => {
        if (!newTypeName.trim()) return;
        mutationType.mutate({
            name: newTypeName.trim(),
            description: newTypeDescription.trim(),
        });
    };

    const handleSubmit = () => {
        const newErrors = {};
        if (!name.trim()) newErrors.name = "El nombre es obligatorio";
        if (!inventoryNum.trim()) newErrors.inventoryNum = "Este campo es obligatorio";
        if (!typeId) newErrors.typeId = "Seleccione un tipo";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setAlertInfo({ type: "error", text: "Complete los campos obligatorios" });
            return;
        }

        setErrors({});
        onAdd({
            name: name.trim(),
            description: description.trim(),
            inventoryNum: inventoryNum.trim(),
            typeId: parseInt(typeId),
        });
        onClose();
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal} style={{ maxWidth: "440px" }}>
                <div className={styles.header}>
                    <h2>Agregar equipamiento</h2>
                    <button
                        type="button"
                        className={styles.closeButton}
                        onClick={onClose}
                        aria-label="Cerrar modal"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {alertInfo && (
                    <Alert severity={alertInfo.type} style={{ margin: "0 28px 8px" }}>
                        {alertInfo.text}
                    </Alert>
                )}

                <div className={styles.content} style={{ paddingBottom: "8px" }}>
                    <div className={styles.formGroup}>
                        <label>
                            Nombre <span className={styles.requiredStar}>*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Ej. OLED TV"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                        />
                        {errors.name && <span className={styles.errorText}>{errors.name}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label>
                            Nº de inventario <span className={styles.requiredStar}>*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Ej. INV-0212"
                            value={inventoryNum}
                            onChange={(e) => setInventoryNum(e.target.value)}
                        />
                        {errors.inventoryNum && <span className={styles.errorText}>{errors.inventoryNum}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label>Descripción</label>
                        <textarea
                            placeholder="Descripción del equipamiento..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{ minHeight: "80px", resize: "vertical" }}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>
                            Tipo <span className={styles.requiredStar}>*</span>
                        </label>
                        <div className={styles.inputWithButton}>
                            <div className={styles.selectWrapper} style={{ flex: 1 }}>
                                <select value={typeId} onChange={(e) => setTypeId(e.target.value)}>
                                    <option value="">Seleccione un tipo</option>
                                    {equipmentTypes?.filter(t => t.deletedAt === null).map((t) => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>
                            <button 
                                type="button" 
                                className={styles.plusButton}
                                onClick={() => setShowAddTypeModal(true)}
                            >
                                <FiPlus size={20} />
                            </button>
                        </div>
                        {errors.typeId && <span className={styles.errorText}>{errors.typeId}</span>}
                    </div>
                </div>

                <div className={styles.footer}>
                    <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        className={styles.submitButton}
                        onClick={handleSubmit}
                    >
                        Agregar
                    </button>
                </div>
            </div>

            {/* Modal for adding Type (Nested) */}
            {showAddTypeModal && (
                <div className={styles.overlay} style={{ zIndex: 10001 }}>
                    <div className={styles.modal} style={{ maxWidth: '400px' }}>
                        <div className={styles.header}>
                            <h2>Nuevo tipo de equipo</h2>
                            <button type="button" className={styles.closeButton} onClick={() => setShowAddTypeModal(false)}>
                                <FiX size={20} />
                            </button>
                        </div>
                        <div className={styles.content}>
                            <div className={styles.formGroup}>
                                <label>Nombre <span className={styles.requiredStar}>*</span></label>
                                <input type="text" placeholder="Ej. Pantalla" value={newTypeName} onChange={(e) => setNewTypeName(e.target.value)} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Descripción</label>
                                <textarea placeholder="Ej. Equipo de proyección..." value={newTypeDescription} onChange={(e) => setNewTypeDescription(e.target.value)} style={{ height: '80px' }}></textarea>
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
}

export default CreateAssetModal;
