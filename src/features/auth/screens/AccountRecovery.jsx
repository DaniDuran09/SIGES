import styles from '../styles/AccountRecovery.module.css';
import { useNavigate } from "react-router-dom";
import Alert from '@mui/material/Alert';


function AccountRecovery() {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>

            <div className={styles.card}>

                <h1 className={styles.title}>Recuperación de cuenta</h1>

                <p className={styles.description}>

                    Ingrese el correo al cuál se enviará el mensaje con el
                    enlace para restablecer una nueva contraseña.

                </p>

                <div className={styles.inputGroup}>

                    <label htmlFor="email" className={styles.label}>Correo</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="ejemplo@utez.edu.mx"
                        className={styles.input}

                    />
                </div>

                <div className={styles.buttonContainer}>
                    <button

                        className={styles.btnCancel}
                        onClick={() => navigate("/Login")}
                    >
                        Cancelar

                    </button>

                    <button className={styles.btnReset}>

                        Restablecer

                    </button>

                </div>

            </div>

        </div>
    );
}

export default AccountRecovery;