import styles from '../styles/AccountRecovery.module.css';
import { useNavigate } from "react-router-dom";
import Alert from '@mui/material/Alert';
import {useState} from "react";
import { useMutation } from '@tanstack/react-query';
import {apiFetch} from "../../../api/client.js";

function AccountRecovery() {
    const navigate = useNavigate();

    const [sended, setSend] = useState(false);
    const [alert, setAlert] = useState({});
    const [mail, setMail] = useState('');

    const mutation = useMutation({
        mutationFn: (credentials) =>
            apiFetch('/password-recovery/request', {
                method: 'POST',
                body: JSON.stringify(credentials),
            }),
        onSuccess: (data) => {
           console.log(data)
        },
        onError: (error) => {
            console.log(error);

        }
    });

    const validateEmail = (email) => {
        const domain = 'utez.edu.mx';
        const atSymbolIndex = email.indexOf('@');

        if (atSymbolIndex <= 0 || atSymbolIndex === email.length - 1) {
            return false;
        }

        const emailDomain = email.substring(atSymbolIndex + 1);

        const isFromUtez = (emailDomain === domain);
        return isFromUtez;
    };


    const handleSendMail = () => {
        try {
            if (mail === '' || !validateEmail(mail)) {
                setAlert({ severity: 'error', text: 'Ingresa un correo válido' });
                return;
            }
            mutation.mutate({
                email: mail.trim(),
                platform: "WEB"
            })
            setSend(true);
            setAlert({ severity: 'success', text: 'Correo enviado' });

        } catch (e) {
            console.error(e);
            setAlert({ severity: 'error', text: 'Ocurrió un error inesperado' });
        }
    };


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