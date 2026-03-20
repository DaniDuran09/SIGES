import { useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import styles from "../../configuration/styles/EditProfile.module.css";

function EditProfile() {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>

            <div className={styles.header}>
                <h4>Gestión</h4>

                <div className={styles.headerRow}>
                    <h1>Configuración</h1>
                </div>

                <button
                    className={styles.returnButton}
                    onClick={() => navigate("/Configuration")}
                >
                    <GoArrowLeft />
                    Volver
                </button>
            </div>

            <div className={styles.card}>

                <div className={styles.cardHeader}>
                    <h2>Editar Perfil</h2>
                </div>

                <div className={styles.cardBody}>

                    <div className={styles.avatar}>
                        JD
                    </div>

                    <div className={styles.form}>

                        <div className={styles.inputGroup}>
                            <label>Nombre</label>
                            <input type="text" defaultValue="José Domínguez" />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Número telefónico</label>
                            <input type="text" defaultValue="+52 111 222 3333" />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Fecha de nacimiento</label>
                            <input type="date" defaultValue="1990-01-16" />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Correo electrónico</label>
                            <input type="email" defaultValue="administrador@utez.edu.mx" />
                        </div>

                    </div>

                </div>

                <div className={styles.actions}>
                    <button className={styles.cancelButton}>Cancelar</button>
                    <button className={styles.saveButton}>Guardar Cambios</button>
                </div>

            </div>

        </div>
    );
}

export default EditProfile;