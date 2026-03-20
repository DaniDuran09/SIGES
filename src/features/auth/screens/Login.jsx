import { useState } from 'react';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import styles from '../styles/Login.module.css';
import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '../../../api/client';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Alert } from '@mui/material';

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [textButton, setTextButton] = useState("Iniciar Sesión");
    const [localError, setLocalError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: (credentials) =>
            apiFetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify(credentials),
            }),
        onSuccess: (data) => {
            login(data);
            navigate("/", { replace: true });
            setTextButton("Iniciar Sesión");
        },
        onError: (error) => {
            setTextButton("Iniciar Sesión");
        }
    });

    const handleLogin = (e) => {
        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            setLocalError("Ingrese su usuario y contraseña");
            return;
        }

        setLocalError('');
        setTextButton("Cargando...");

        mutation.mutate({
            identifier: email.trim(),
            password: password.trim()
        });
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.loginCard}>
                <div className={styles.header}>
                    <div className={styles.logoBox}>
                        <span className={styles.logoText}>S</span>
                    </div>
                    <h2 className={styles.title}>SIGES</h2>
                    <p className={styles.subtitle}>Sistema de Gestión de Equipos y Espacios</p>
                </div>

                <form className={styles.form} onSubmit={handleLogin}>
                    {localError && (
                        <Alert severity="error">
                            {localError}
                        </Alert>
                    )}

                    {mutation.error && (
                        <Alert severity="error">
                            {mutation.error.message}
                        </Alert>
                    )}

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Usuario / Correo electronico</label>
                        <div className={styles.inputWrapper}>
                            <HiOutlineMail className={styles.icon} />
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Usuario / Correo electronico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Contraseña</label>
                        <div className={styles.inputWrapper}>
                            <HiOutlineLockClosed className={styles.icon} />
                            <input
                                type={showPassword ? "text" : "password"}
                                className={styles.input}
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className={styles.eyeButton}
                            >
                                {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                            </button>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <a className={styles.forgotPassword}>
                            ¿Olvidaste tu contraseña?
                        </a>
                    </div>

                    <button
                        type="submit"
                        className={styles.loginButton}
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? "Cargando..." : textButton}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;