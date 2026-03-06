import { FiX } from "react-icons/fi";
import styles from "./NewUserModal.module.css";

function NewUserModal({ onClose }) {
    return (
        <div className={styles.overlay}>

            <div className={styles.modal}>

                <div className={styles.header}>
                    <h2>Registro de usuario</h2>
                    <button className={styles.closeButton} onClick={onClose} aria-label="Cerrar modal">
                        <FiX size={20} />
                    </button>
                </div>

                <div className={styles.content}>

                    <div className={styles.formGroup}>

                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>

                        </div>
                        <div className={styles.formGroup}>

                        </div>
                    </div>

                    <div className={styles.formGroup}>

                    </div>

                    <div className={styles.formGroup}>

                        <div className={styles.toggleContainer}>

                        </div>
                    </div>

                </div>

                <div className={styles.footer}>
                    <button className={styles.cancelButton} onClick={onClose}>
                        Cancelar
                    </button>
                    <button
                        className={styles.submitButton}
                        onClick={onClose}
                    >
                        Registrar Usuario
                    </button>
                </div>

            </div>
        </div>
    );
}

export default NewUserModal;