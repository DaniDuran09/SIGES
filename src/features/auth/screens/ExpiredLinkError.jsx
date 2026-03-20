import { useNavigate } from "react-router-dom";
import styles from "../styles/NewPassword.module.css";

export default function ExpiredLinkError() {
    const navigate = useNavigate();

    const navigateToLogin = () => {
        navigate("/login");
    };

    return (
        <div className={styles.container}>
            <div className={`${styles.card} ${styles.cardError}`}>
                <h1 className={styles.title}>Restablecer contraseña</h1>
                <h2 className={styles.subtitle}>Error en la solicitud</h2>
                <p className={styles.message}>
                    El límite de tiempo para restablecer la contraseña ha rebasado el tiempo, solicite nuevamente el cambio de contraseña
                </p>
                <div className={styles.buttonContainer}>
                    <button className={styles.btnCancel} onClick={navigateToLogin}>
                        Cancelar
                    </button>
                    <button className={styles.btnSubmit} onClick={() => navigate("/AccountRecovery")}>
                        Aceptar
                    </button>
                </div>
            </div>
        </div>
    );
}
