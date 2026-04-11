import { useState, useEffect } from "react";
import styles from "../styles/Catalogue.module.css";

const EditCatalogueModal = ({ isOpen, onClose, onSave, initialData, isSaving, isNew, hasDescription }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (initialData && !isNew) {
            setName(initialData.name || "");
            setDescription(initialData.description || "");
        } else {
            setName("");
            setDescription("");
        }
    }, [initialData, isNew, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onSave({ name: name.trim(), description: description.trim() });
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>{isNew ? "Nuevo Registro" : "Editar Registro"}</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="name">Nombre</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ingrese nombre..."
                            autoFocus
                        />
                    </div>
                    {hasDescription && (
                        <div className={styles.inputGroup}>
                            <label htmlFor="description">Descripción</label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Ingrese descripción..."
                                rows="3"
                                style={{
                                    width: "100%", padding: "10px", borderRadius: "8px",
                                    border: "1px solid #E2E8F0", fontFamily: "inherit", resize: "vertical"
                                }}
                            />
                        </div>
                    )}
                    <div className={styles.modalActions}>
                        <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={isSaving}>
                            Cancelar
                        </button>
                        <button type="submit" className={styles.saveBtn} disabled={isSaving || !name.trim()}>
                            {isSaving ? "Guardando..." : "Guardar Cambios"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCatalogueModal;
