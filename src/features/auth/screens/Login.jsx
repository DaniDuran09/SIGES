import { useState } from 'react';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import styles from '../styles/Login.module.css';
import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '../../../api/client';
import { useAuth } from '../../../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        mutation.mutate({
            identifier: email.trim(),
            password: password.trim()
        });

    };

    const mutation = useMutation({
        mutationFn: (credentials) =>
            apiFetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify(credentials),
            }),
        onSuccess: (data) => {
            login(data.accessToken)
            navigate("/", { replace: true });
        },
        onError: (error) => {
            console.log("Error", error.message);
        }
    });

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

                <form
                    className={styles.form}
                    onSubmit={handleLogin}
                >

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Correo Electrónico</label>
                        <div className={styles.inputWrapper}>
                            <HiOutlineMail className={styles.icon} />
                            <input
                                type="email"
                                className={styles.input}
                                placeholder="nombre@ejemplo.com"
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

                    {/* 
                    <div className={styles.formFooter}>
                        <label className={styles.rememberMe}>
                            <input type="checkbox" className={styles.checkbox} />
                            <span>Recordarme</span>
                        </label>
                        <a className={styles.forgotPassword}>
                            ¿Olvidaste tu contraseña?
                        </a>
                    </div>
                    */}

                    <button type="submit" className={styles.loginButton}>
                        Iniciar Sesión
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;