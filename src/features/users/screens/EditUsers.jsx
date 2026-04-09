import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../../api/client";
import { FiArrowLeft } from "react-icons/fi";
import LoaderCircle from "../../../assets/components/LoaderCircle";
import { Alert, Snackbar } from "@mui/material";
import styles from "../styles/EditUsers.module.css";

function EditUsers() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [successMessage, setSuccessMessage] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        type: "",
        employeeId: "",
        email: "",
        phone: ""
    });

    const { data: user, isPending } = useQuery({
        queryKey: ["GetUserForEdit", id],
        queryFn: () => apiFetch(`/users/${id}`, { method: "GET" }),
        retry: (count, err) => err.status !== 404 && count < 2
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
                type: user.role === "ADMIN" ? "Administrador" : user.role === "STUDENT" ? "Estudiante" : "Personal",
                employeeId: user.registrationNumber || user.employeeNumber || "",
                email: user.email || "",
                phone: user.phoneNumber || ""
            });
        }
    }, [user]);

    const mutation = useMutation({
        mutationFn: (updatedData) => apiFetch(`/users/${id}/email`, {
            method: "PUT",
            body: JSON.stringify(updatedData)
        }),
        onSuccess: () => {
            queryClient.invalidateQueries(["GetUsers"]);
            queryClient.invalidateQueries(["GetUserForEdit", id]);
            setSuccessMessage("Usuario actualizado correctamente");
            setTimeout(() => navigate("/users"), 1500);
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const parts = formData.name.trim().split(" ");
        const firstName = parts[0] || "";
        const lastName = parts.slice(1).join(" ") || "";

        let payload = {
            firstName,
            lastName,
            email: formData.email,
            phoneNumber: formData.phone,
        };

        if (formData.type === "Estudiante") {
            payload.registrationNumber = formData.employeeId;
        } else {
            payload.employeeNumber = formData.employeeId;
        }

        mutation.mutate(payload);
    };

    if (isPending) return <LoaderCircle />;
    if (!user) return (
        <div className={styles.container}>
            <button className={styles.backButton} onClick={() => navigate("/users")}>
                <FiArrowLeft /> Volver
            </button>
            <div style={{ textAlign: "center", marginTop: "50px" }}>Usuario no encontrado</div>
        </div>
    );

    const isActive = user.enabled ?? user.active;

    return (
        <div className={styles.container}>
            <Snackbar open={!!successMessage} autoHideDuration={3000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert severity="success" sx={{ width: '100%' }}>{successMessage}</Alert>
            </Snackbar>

            <div className={styles.header}>
                <h4>Gestión</h4>
                <div className={styles.headerRow}>
                    <h1>Usuarios</h1>
                </div>
            </div>

            <button className={styles.backButton} onClick={() => navigate("/users")}>
                <FiArrowLeft /> Volver
            </button>

            <div className={styles.mainCard}>
                <div className={styles.cardHeader}>
                    <h2>Editar información</h2>
                    <span className={`${styles.statusBadge} ${isActive ? styles.active : styles.inactive}`}>
                        {isActive ? "Activo" : "Inactivo"}
                    </span>
                </div>

                <form className={styles.cardContent} onSubmit={handleSubmit}>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label>Nombre y apellido <span className={styles.requiredStar}>*</span></label>
                            <input name="name" value={formData.name} onChange={handleChange} required />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Tipo <span className={styles.requiredStar}>*</span></label>
                            <select name="type" value={formData.type} onChange={handleChange} required>
                                <option value="Personal">Personal</option>
                                <option value="Administrador">Administrador</option>
                                <option value="Estudiante">Estudiante</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Matrícula / Nº empleado {formData.type !== "Administrador" && <span className={styles.requiredStar}>*</span>}</label>
                            <input
                                name="employeeId"
                                value={formData.employeeId}
                                onChange={handleChange}
                                required={formData.type !== "Administrador"}
                                disabled={formData.type === "Administrador"}
                                placeholder={formData.type === "Administrador" ? "No aplica para administradores" : ""}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Correo <span className={styles.requiredStar}>*</span></label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Teléfono</label>
                            <input name="phone" value={formData.phone} onChange={handleChange} />
                        </div>
                    </div>

                    {mutation.isError && <Alert severity="error" sx={{ mt: 2 }}>{mutation.error.message}</Alert>}

                    <div className={styles.bottomSection}>
                        <div className={styles.footerButtons}>
                            <button type="button" className={styles.cancelBtn} onClick={() => navigate("/users")}>Cancelar</button>
                            <button type="submit" className={styles.saveBtn} disabled={mutation.isPending}>
                                {mutation.isPending ? "Guardando..." : "Guardar Cambios"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditUsers;
