import { useState } from "react";
import { FiX } from "react-icons/fi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../../api/client";
import { Alert } from "@mui/material";
import styles from "../../equipment/components/NewEquipmentModal.module.css";

function AddAssetModal({ spaceId, onClose }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [inventoryNum, setInventoryNum] = useState("");
    const [typeId, setTypeId] = useState("");
    const [alertInfo, setAlertInfo] = useState(null);
    const [errors, setErrors] = useState({});

    const queryClient = useQueryClient();

    const { data: equipmentTypes } = useQuery({
        queryKey: ["getEquipmentTypes"],
        queryFn: () => apiFetch("/equipment-types", { method: "GET" }),
    });

    const mutation = useMutation({
        mutationFn: (data) =>
            apiFetch(`/spaces/${spaceId}/assets`, {
                method: "POST",
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["GetSpaceDetail", String(spaceId)] });
            queryClient.invalidateQueries({ queryKey: ["GetSpaceAssets", String(spaceId)] });
            setAlertInfo({ type: "success", text: "Equipamiento agregado correctamente" });
            setTimeout(() => onClose(), 1500);
        },
        onError: (error) => {
            setAlertInfo({ type: "error", text: error.message || "Error al agregar el equipamiento" });
        },
    });

    const handleSubmit = () => {
        const newErrors = {};
        if (!name.trim()) newErrors.name = "El nombre es obligatorio";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        mutation.mutate({
            name: name.trim(),
            description: description.trim(),
            inventoryNum: inventoryNum.trim(),
            typeId: typeId ? parseInt(typeId) : 0,
        });
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
                        <label>Nº de inventario</label>
                        <input
                            type="text"
                            placeholder="Ej. INV-0212"
                            value={inventoryNum}
                            onChange={(e) => setInventoryNum(e.target.value)}
                        />
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
                        <label>Tipo</label>
                        <div className={styles.selectWrapper}>
                            <select value={typeId} onChange={(e) => setTypeId(e.target.value)}>
                                <option value="">Sin tipo</option>
                                {equipmentTypes?.filter(t => t.deletedAt === null).map((t) => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className={styles.footer}>
                    <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={onClose}
                        disabled={mutation.isPending}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        className={styles.submitButton}
                        onClick={handleSubmit}
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? "Agregando..." : "Agregar"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddAssetModal;
