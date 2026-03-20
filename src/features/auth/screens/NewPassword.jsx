import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "../styles/NewPassword.module.css";

export default function NewPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    const token = searchParams.get("token");
    const email = searchParams.get("email");

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
            alert("Las contraseñas no coinciden");
            return;
        }
        console.log("Submit new password logic here");
    };

    const navigateToLogin = () => {
        navigate("/login");
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
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
