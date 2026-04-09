import { useState } from 'react';
import { FiX, FiEye, FiEyeOff } from 'react-icons/fi';
import { useMutation } from '@tanstack/react-query';
import { Alert } from '@mui/material';
import styles from '../styles/ChangePasswordModal.module.css';
import { apiFetch } from '../../../api/client';

export const ChangePasswordModal = ({ onClose }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [alertInfo, setAlertInfo] = useState(null);
    const [errors, setErrors] = useState({});

    const updatePasswordMutation = useMutation({
        mutationFn: (data) => apiFetch("/users/me/password", {
            method: "PATCH",
            headers: {
                'X-API-Version': '1.0.0'
            },
            body: JSON.stringify(data),
        }),
        onSuccess: () => {
            setAlertInfo({ type: 'success', text: 'Contraseña actualizada exitosamente' });
            setTimeout(() => {
                onClose();
            }, 2000);
        },
        onError: (error) => {
            console.log("Error cambiando contraseña", error);
            
            let errorMessage = 'Ocurrió un error inesperado al intentar cambiar la contraseña.';
            if (error.status === 401 || error.status === 403) {
                errorMessage = "La contraseña actual ingresada es incorrecta.";
            } else if (error.message && error.message.length < 100) {
                errorMessage = error.message;
            }
            
            setAlertInfo({ type: 'error', text: errorMessage });
        }
    });

    const handleSubmit = () => {
        let newErrors = {};
        
        if (!oldPassword.trim()) newErrors.oldPassword = "Su contraseña actual es obligatoria";
        if (!newPassword.trim()) newErrors.newPassword = "La nueva contraseña es obligatoria";
        if (!confirmPassword.trim()) newErrors.confirmPassword = "Debe confirmar la contraseña";
        
        // Validación de longitud y formato seguro
        if (newPassword && newPassword.length < 8) {
            newErrors.newPassword = "La contraseña debe tener al menos 8 caracteres";
        } else if (newPassword && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
            newErrors.newPassword = "Debe incluir al menos una mayúscula, minúscula y un número";
        }

        // Validación de que no sea igual a la antigua
        if (newPassword && oldPassword && newPassword === oldPassword) {
            newErrors.newPassword = "La nueva contraseña no puede ser idéntica a la actual";
        }
        
        // Validar que la confirmación coincida
        if (newPassword && confirmPassword && newPassword !== confirmPassword) {
            newErrors.confirmPassword = "Las contraseñas no coinciden";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setAlertInfo(null);
            return;
        }

        setErrors({});
        setAlertInfo(null);

        updatePasswordMutation.mutate({
            oldPassword: oldPassword,
            newPassword: newPassword
        });
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                
                <div className={styles.header}>
                    <h2>Cambiar contraseña</h2>
                    <button 
                        type="button" 
                        className={styles.closeButton} 
                        onClick={onClose} 
                        aria-label="Cerrar modal"
                        disabled={updatePasswordMutation.isPending}
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {alertInfo && (
                    <Alert severity={alertInfo.type} style={{ margin: '0 28px 10px 28px' }}>
                        {alertInfo.text}
                    </Alert>
                )}

                <div className={styles.content}>
                    
                    <div className={styles.formGroup}>
                        <label>Contraseña actual</label>
                        <div className={styles.passwordInputWrapper}>
                            <input 
                                type={showOldPassword ? "text" : "password"} 
                                placeholder="Escribe tu contraseña actual" 
                                value={oldPassword} 
                                onChange={(e) => setOldPassword(e.target.value)} 
                                disabled={updatePasswordMutation.isPending}
                            />
                            <button 
                                type="button" 
                                className={styles.toggleVisibilityButton}
                                aria-label="Mostrar contraseña"
                                onClick={() => setShowOldPassword(!showOldPassword)}
                            >
                                {showOldPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                            </button>
                        </div>
                        {errors.oldPassword && <span style={{color: '#DC2626', fontSize: '13px'}}>{errors.oldPassword}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label>Nueva contraseña</label>
                        <div className={styles.passwordInputWrapper}>
                            <input 
                                type={showNewPassword ? "text" : "password"} 
                                placeholder="Nueva contraseña segura" 
                                value={newPassword} 
                                onChange={(e) => setNewPassword(e.target.value)} 
                                disabled={updatePasswordMutation.isPending}
                            />
                            <button 
                                type="button" 
                                className={styles.toggleVisibilityButton}
                                aria-label="Mostrar contraseña"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                {showNewPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                            </button>
                        </div>
                        {errors.newPassword && <span style={{color: '#DC2626', fontSize: '13px'}}>{errors.newPassword}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label>Confirmar contraseña</label>
                        <div className={styles.passwordInputWrapper}>
                            <input 
                                type={showConfirmPassword ? "text" : "password"} 
                                placeholder="Repite la contraseña" 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                disabled={updatePasswordMutation.isPending}
                            />
                            <button 
                                type="button" 
                                className={styles.toggleVisibilityButton}
                                aria-label="Mostrar contraseña"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                            </button>
                        </div>
                        {errors.confirmPassword && <span style={{color: '#DC2626', fontSize: '13px'}}>{errors.confirmPassword}</span>}
                    </div>

                </div>

                <div className={styles.footer}>
                    <button 
                        type="button" 
                        className={styles.cancelButton} 
                        onClick={onClose} 
                        disabled={updatePasswordMutation.isPending}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        className={styles.submitButton}
                        onClick={handleSubmit}
                        disabled={updatePasswordMutation.isPending}
                    >
                        {updatePasswordMutation.isPending ? "Actualizando..." : "Actualizar"}
                    </button>
                </div>

            </div>
        </div>
    );
};
