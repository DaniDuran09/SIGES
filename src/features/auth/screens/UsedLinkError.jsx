import { useNavigate } from "react-router-dom";
import styles from "../styles/NewPassword.module.css";

export default function UsedLinkError() {
    const navigate = useNavigate();

    const navigateToLogin = () => {
        navigate("/login");
    };

    return (
        <div className={styles.container}>
            <div className={`${styles.card} ${styles.cardError}`}>
                <h1 className={styles.title}>Restablecer contraseña</h1>
                <h2 className={styles.subtitle}>Enlace ya utilizado</h2>
                <p className={styles.message}>
                    El enlace ya fue utilizado, solicite uno nuevo para poder continuar.
                </p>
                <div className={styles.buttonContainer}>
                    <button className={styles.btnCancel} onClick={navigateToLogin}>
                        Cancelar
                    </button>
                    <button className={styles.btnSubmit} onClick={navigateToLogin}>
                        Aceptar
                    </button>
                </div>
            </div>
        </div>
    );
}
