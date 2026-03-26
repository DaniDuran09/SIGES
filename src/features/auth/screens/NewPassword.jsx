import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "../styles/NewPassword.module.css";
import {useMutation} from "@tanstack/react-query";
import {apiFetch} from "../../../api/client.js";
import {Alert} from "@mui/material";

export default function NewPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    const [alertSeverity, setAlertSeverity] = useState('false');
    const [alertMessage, setAlertMessage] = useState("");
    const [localAlert, setLocalAlert] = useState("");

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });

    const accountEmail = email || "[Correo no encontrado]";

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setAlertSeverity("error");
            setAlertMessage("las contraseñas no coinciden")
            setLocalAlert(true);
            return;
        }
        setLocalAlert(false)
        mutation.mutate({
            token: token,
            newPassword: formData.password,
        })
    };

    const mutation = useMutation({
        mutationFn: (credentials) =>
            apiFetch('/password-recovery/reset', {
                method: 'PATCH',
                body: JSON.stringify(credentials),
            }),
        onSuccess: () => {
            setAlertSeverity("success");
            setAlertMessage("Contraseña cambiada correctamente");
            setLocalAlert(true);
            setTimeout(()=>{
                navigate("/login", { replace: true });
            },5000)

        },
        onError: (e) => {
            const messages = {
                403: "No tienes permisos para esta acción.",
                404: "Recurso no encontrado.",
                409: "Conflicto con los datos enviados.",
                500: "Error del servidor, intenta más tarde.",
            };
            setAlertSeverity("error");
            setAlertMessage(messages[e.status] ?? e.message ?? "Error inesperado");
            console.log(e)
            setLocalAlert(true);
        }
    });

    const navigateToLogin = () => {
        navigate("/login");
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                {localAlert && (
                    <Alert severity={alertSeverity} >
                        {alertMessage}
                    </Alert>
                )}
                <h1 className={styles.title}>Restablecer contraseña</h1>
                <form onSubmit={handleFormSubmit}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Cuenta</label>
                        <input
                            type="email"
                            className={styles.input}
                            value={accountEmail}
                            disabled
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            Nueva Contraseña <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="password"
                            name="password"
                            className={styles.input}
                            placeholder="Contraseña"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            Confirmar Contraseña <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            className={styles.input}
                            placeholder="Confirmar contraseña"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.buttonContainer}>
                        <button type="button" className={styles.btnCancel} onClick={navigateToLogin}>
                            Cancelar
                        </button>
                        <button type="submit" className={styles.btnSubmit}>
                            Restablecer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
