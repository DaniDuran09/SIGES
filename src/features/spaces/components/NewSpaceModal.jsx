import styles from './NewSpaceModal.module.css';
import { FiX } from 'react-icons/fi';

export const NewSpaceModal = ({ onClose }) => {

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
                                <option value="1">Auditorio</option>
                                <option value="2">Sala</option>
                                <option value="3">Laboratorio</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Ubicación</label>
                            <input type="text" placeholder="Ej. Edificio A" />
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