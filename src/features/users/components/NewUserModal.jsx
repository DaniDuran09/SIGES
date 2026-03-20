import { useState } from "react";
import { FiX } from "react-icons/fi";
import styles from "./NewUserModal.module.css";
import { Alert } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../../api/client";

function NewUserModal({ onClose }) {
    const [fullName, setFullName] = useState("");
    const [userType, setUserType] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [employeeId, setEmployeeId] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [alertInfo, setAlertInfo] = useState(null);
    const [errors, setErrors] = useState({});

    const queryClient = useQueryClient();

    const generatePassword = () => {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";
        let newPassword = "";
        for (let i = 0, n = charset.length; i < 10; ++i) {
            newPassword += charset.charAt(Math.floor(Math.random() * n));
        }
        setPassword(newPassword);
        setConfirmPassword(newPassword);
        setShowPassword(true);
    };

    const mutationUser = useMutation({
        mutationFn: (data) => apiFetch(`/${userType}`, {
            method: "POST",
            body: JSON.stringify(data),
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getUsers"] });
            setAlertInfo({ type: 'success', text: 'Usuario registrado exitosamente' });
            setTimeout(() => {
                onClose();
            }, 2000);
        },
        onError: (error) => {
            console.log("Error", error.message);
            setAlertInfo({ type: 'error', text: error.message || 'Error al registrar el usuario' });
        }
    });

    const handleRegister = () => {
        let newErrors = {};

        if (!fullName.trim()) newErrors.fullName = "Este campo es obligatorio";
        if (!userType) newErrors.userType = "Este campo es obligatorio";
        if (!birthDate.trim()) newErrors.birthDate = "Este campo es obligatorio";
        if (userType !== 'admins' && !employeeId.trim()) newErrors.employeeId = "Este campo es obligatorio";
        if (!phone.trim()) newErrors.phone = "Este campo es obligatorio";
        if (!email.trim()) newErrors.email = "Este campo es obligatorio";

        if (!password) {
            newErrors.password = "Este campo es obligatorio";
        } else if (password.length < 8) {
            newErrors.password = "Mínimo 8 caracteres";
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Este campo es obligatorio";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Las contraseñas no coinciden";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setAlertInfo({ type: 'error', text: 'Todos los campos marcados con un asterisco son obligatorios' });
            return;
        }

        setErrors({});
        setAlertInfo(null);

        const parts = fullName.trim().split(" ");
        const firstName = parts[0] || "";
        const lastName = parts.slice(1).join(" ") || "";

        let payload = {
            email: email.trim(),
            phoneNumber: phone.trim(),
            firstName: firstName,
            lastName: lastName,
            birthDate: birthDate.trim(),
            password // Incluido por si lo ocupa el backend
        };

        if (userType === 'institutional-staff') {
            payload.employeeNumber = employeeId.trim();
        } else if (userType === 'students') {
            payload.registrationNumber = employeeId.trim();
        }

        mutationUser.mutate(payload);
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal} style={{ maxWidth: '500px' }}>
                <div className={styles.header}>
                    <h2>Registro de usuario</h2>
                    <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Cerrar modal">
                        <FiX size={20} />
                    </button>
                </div>

                {alertInfo && (
                    <Alert severity={alertInfo.type} style={{ margin: '10px 20px 0 20px' }}>
                        {alertInfo.text}
                    </Alert>
                )}

                <div className={styles.content} style={{ marginTop: alertInfo ? '16px' : '0' }}>

                    <div className={styles.formGroup}>
                        <label>Nombre completo <span className={styles.requiredStar}>*</span></label>
                        <input type="text" placeholder="Nombre Apellido" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                        {errors.fullName && <span className={styles.errorText}>{errors.fullName}</span>}
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Tipo <span className={styles.requiredStar}>*</span></label>
                            <div className={styles.selectWrapper}>
                                <select value={userType} onChange={(e) => setUserType(e.target.value)}>
                                    <option value="" disabled>Seleccione...</option>
                                    <option value="students">Estudiante</option>
                                    <option value="institutional-staff">Personal Institucional</option>
                                    <option value="admins">Administrador</option>
                                </select>
                            </div>
                            {errors.userType && <span className={styles.errorText}>{errors.userType}</span>}
                        </div>
                        <div className={styles.formGroup}>
                            <label>Fecha nacimiento <span className={styles.requiredStar}>*</span></label>
                            <input type="text" placeholder="Ej. AAAA-MM-DD" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
                            {errors.birthDate && <span className={styles.errorText}>{errors.birthDate}</span>}
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        {userType !== 'admins' ? (
                            <div className={styles.formGroup}>
                                <label>{userType === 'students' ? 'Matrícula' : userType === 'institutional-staff' ? 'N° Empleado' : 'Matrícula / N° Empleado'} <span className={styles.requiredStar}>*</span></label>
                                <input type="text" placeholder={userType === 'institutional-staff' ? "Ej. IN-002" : "Ej. MAT-202601XXX"} value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} />
                                {errors.employeeId && <span className={styles.errorText}>{errors.employeeId}</span>}
                            </div>
                        ) : (
                            <div className={styles.formGroup} style={{ visibility: 'hidden' }}></div>
                        )}
                        <div className={styles.formGroup}>
                            <label>Teléfono <span className={styles.requiredStar}>*</span></label>
                            <input type="tel" placeholder="Ej. +525512345678" value={phone} onChange={(e) => setPhone(e.target.value)} />
                            {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Correo <span className={styles.requiredStar}>*</span></label>
                        <input type="email" placeholder="Ej. ejemplo@inst.edu.mx" value={email} onChange={(e) => setEmail(e.target.value)} />
                        {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label>Contraseña inicial <span className={styles.requiredStar}>*</span></label>
                            <button type="button" className={styles.generateButton} onClick={generatePassword}>
                                Autogenerar
                            </button>
                        </div>
                        <input type={showPassword ? "text" : "password"} placeholder="Mínimo 8 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} />
                        {errors.password && <span className={styles.errorText}>{errors.password}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label>Confirmar contraseña <span className={styles.requiredStar}>*</span></label>
                            {password && (
                                <button type="button" className={styles.generateButton} onClick={() => setShowPassword(!showPassword)} style={{ textDecoration: 'none', fontSize: '13px' }}>
                                    {showPassword ? "Ocultar" : "Mostrar"}
                                </button>
                            )}
                        </div>
                        <input type={showPassword ? "text" : "password"} placeholder="Mínimo 8 caracteres" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
                    </div>

                </div>

                <div className={styles.footer}>
                    <button type="button" className={styles.cancelButton} onClick={onClose} disabled={mutationUser.isPending}>
                        Cancelar
                    </button>
                    <button
                        type="button"
                        className={styles.submitButton}
                        onClick={handleRegister}
                        disabled={mutationUser.isPending}
                    >
                        {mutationUser.isPending ? "Registrando..." : "Registrar Usuario"}
                    </button>
                </div>

            </div>
        </div>
    );
}

export default NewUserModal;