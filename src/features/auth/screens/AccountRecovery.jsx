import styles from '../styles/AccountRecovery.module.css';
import { useNavigate } from "react-router-dom";
import Alert from '@mui/material/Alert';
import {useState} from "react";

function AccountRecovery() {
    const navigate = useNavigate();
    const [sended, setSend] = useState(false);
    const [alert, setAlert] = useState({});
    const [mail, setMail] = useState('');

    const handleSendMail = (() => {
        setSend(true);
        if(mail === ''){setAlert({severity: 'error', text: 'Ingresa un correo valido'});}
        else{
            setAlert({severity: 'info', text: 'Correo enviado exitosamente'});
        }
    })

    return (
        <div className={styles.container}>
            <div className={styles.card}>

                <h1 className={styles.title}>Recuperación de cuenta</h1>

                <p className={styles.description}>
                    Ingrese el correo al cuál se enviará el mensaje con el
                    enlace para restablecer una nueva contraseña.
                </p>

                {sended && (
                    <div className={styles.alertWrapper}>
                        <Alert severity={alert.severity}>{alert.text}</Alert>
                    </div>
                )}

                <div className={styles.inputGroup}>
                    <label htmlFor="email" className={styles.label}>Correo <span style={{ color: '#ef4444' }}>*</span></label>
                    <input
                        type="email"
                        id="email"
                        placeholder="ejemplo@utez.edu.mx"
                        className={styles.input}
                        onChange={e => setMail(e.target.value)}
                    />
                </div>

                <div className={styles.buttonContainer}>
                    <button
                        className={styles.btnCancel}
                        onClick={() => navigate("/login")}
                    >
                        Regresar
                    </button>

                    <button
                        className={styles.btnReset}
                        onClick={() => handleSendMail()}
                    >
                        Restablecer
                    </button>
                </div>

            </div>

        </div>
    );
}

export default AccountRecovery;