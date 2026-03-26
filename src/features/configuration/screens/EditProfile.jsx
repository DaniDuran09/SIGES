import { useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import styles from "../../configuration/styles/EditProfile.module.css";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../../api/client";
import LoaderCircle from "../../../assets/components/LoaderCircle";
import { Alert } from "@mui/material";
import {useEffect} from "react";

function EditProfile() {
    const navigate = useNavigate();

    const {
        data: b_user,
        isPending,
        error
    } = useQuery({
        queryKey: ["GetUser"],
        queryFn: () =>
            apiFetch(`/users/me`, {
                method: "GET",
            }),
        retry: (failureCount, error) => error.status !== 404,
    });

    useEffect(() => {
        console.log(b_user);
    }, [b_user]);

    if (error && error.status !== 404) {
        return (
            <div className={styles.container}>
                <Alert severity="error">
                    Error al cargar el usuario: {error.message}
                </Alert>
            </div>
        );
    }

    if (isPending) {
        return <LoaderCircle />;
    }

    return (
        <div className={styles.container}>

            <div className={styles.header}>
                <h4>Gestión</h4>

                <div className={styles.headerRow}>
                    <h1>Configuración</h1>
                </div>

                <button
                    className={styles.returnButton}
                    onClick={() => navigate("/Configuration")}
                >
                    <GoArrowLeft />
                    Volver
                </button>
            </div>

            <div className={styles.card}>

                <div className={styles.cardHeader}>
                    <h2>Editar Perfil</h2>
                </div>

                <div className={styles.cardBody}>

                    <div className={styles.avatar}>
                        {b_user?.firstName?.charAt(0)}
                        {b_user?.lastName?.charAt(0)}
                    </div>

                    <div className={styles.form}>

                        <div className={styles.inputGroup}>
                            <label>Nombre</label>
                            <input
                                type="text"
                                value={`${b_user?.firstName} ${b_user?.lastName}`}
                                readOnly
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Número telefónico</label>
                            <input
                                type="text"
                                value={b_user?.phoneNumber || ""}
                                readOnly
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Fecha de nacimiento</label>
                            <input
                                type="date"
                                value={b_user?.birthDate || ""}
                                readOnly
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Correo electrónico</label>
                            <input
                                type="email"
                                value={b_user?.email || ""}
                                readOnly
                            />
                        </div>

                    </div>

                </div>

                <div className={styles.actions}>
                    <button
                        className={styles.cancelButton}
                        onClick={() => navigate("/Configuration")}
                    >
                        Cancelar
                    </button>

                    <button className={styles.saveButton}>
                        Guardar Cambios
                    </button>
                </div>

            </div>

        </div>
    );
}

export default EditProfile;