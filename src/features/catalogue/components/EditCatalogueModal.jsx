import { useState, useEffect } from "react";
import styles from "../styles/Catalogue.module.css";

const EditCatalogueModal = ({ isOpen, onClose, onSave, initialData, isSaving }) => {
    const [name, setName] = useState("");

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || "");
        }
    }, [initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onSave(name.trim());
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>Editar Nombre</h2>
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
