import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../../api/client";
import { FiArrowLeft, FiPlus, FiTrash2, FiSave, FiX } from "react-icons/fi";
import LoaderCircle from "../../../assets/components/LoaderCircle";
import { Alert, Snackbar } from "@mui/material";
import styles from "./EditSpace.module.css";

function EditSpace() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [successMessage, setSuccessMessage] = useState("");

    // Form states
    const [formData, setFormData] = useState({
        name: "",
        spaceTypeId: "",
        buildingId: "",
        capacity: "",
        bookInAdvanceDuration: "",
        advanceUnit: "HOUR",
        description: "",
        availableForStudents: true,
        availabilitySlots: []
    });

    const { data: space, isPending, error } = useQuery({
        queryKey: ["GetSpaceForEdit", id],
        queryFn: () => apiFetch(`/spaces/${id}`, { method: "GET" }),
    });

    const { data: types } = useQuery({
        queryKey: ["GetSpaceTypes"],
        queryFn: () => apiFetch("/space-types", { method: "GET" }),
    });

    const { data: buildings } = useQuery({
        queryKey: ["GetBuildings"],
        queryFn: () => apiFetch("/buildings", { method: "GET" }),
    });

    useEffect(() => {
        if (space) {
            // Parse duration if needed (e.g. "24 HOURS" -> 24)
            const durationPart = space.bookInAdvanceDuration?.split(" ")[0] || "";
            const unitPart = space.bookInAdvanceDuration?.split(" ")[1] || "HOUR";

            setFormData({
                name: space.name,
                spaceTypeId: space.spaceType?.id || "",
                buildingId: space.building?.id || "",
                capacity: space.capacity,
                bookInAdvanceDuration: durationPart,
                advanceUnit: unitPart,
                description: space.description,
                availableForStudents: space.availableForStudents,
                availabilitySlots: space.availabilitySlots || []
            });
        }
    }, [space]);

    const mutation = useMutation({
        mutationFn: (updatedData) => apiFetch(`/spaces/${id}`, {
            method: "PUT",
            body: JSON.stringify(updatedData)
        }),
        onSuccess: () => {
            queryClient.invalidateQueries(["GetSpaceForEdit", id]);
            queryClient.invalidateQueries(["GetSpaces"]);
            setSuccessMessage("Espacio actualizado correctamente");
            setTimeout(() => navigate("/spaces"), 1500);
        }
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const payload = {
            ...formData,
            bookInAdvanceDuration: `${formData.bookInAdvanceDuration} ${formData.advanceUnit}`,
            capacity: parseInt(formData.capacity)
        };

        mutation.mutate(payload);
    };

    if (isPending) return <LoaderCircle />;

    return (
        <div className={styles.container}>
            <Snackbar 
                open={!!successMessage} 
                autoHideDuration={6000} 
                onClose={() => setSuccessMessage("")}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity="success" sx={{ width: '100%' }}>{successMessage}</Alert>
            </Snackbar>

            <div className={styles.header}>
                <h4>Gestión</h4>
                <div className={styles.headerRow}>
                    <h1>Espacios</h1>
                </div>
            </div>

            <button className={styles.backButton} onClick={() => navigate("/spaces")}>
                <FiArrowLeft /> Volver
            </button>

            <div className={styles.mainCard}>
                <div className={styles.cardHeader}>
                    <h2>Editar {formData.name}</h2>
                </div>

                <form className={styles.cardContent} onSubmit={handleSubmit}>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label>Nombre del espacio *</label>
                            <input 
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Tipo *</label>
                            <select 
                                name="spaceTypeId"
                                value={formData.spaceTypeId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccionar tipo</option>
                                {types?.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Tiempo de anticipación *</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input 
                                    style={{ flex: 1 }}
                                    name="bookInAdvanceDuration"
                                    type="number"
                                    value={formData.bookInAdvanceDuration}
                                    onChange={handleChange}
                                    required
                                />
                                <select 
                                    style={{ flex: 1 }}
                                    name="advanceUnit"
                                    value={formData.advanceUnit}
                                    onChange={handleChange}
                                >
                                    <option value="HOUR">Hora</option>
                                    <option value="DAY">Día</option>
                                </select>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Ubicación *</label>
                            <select 
                                name="buildingId"
                                value={formData.buildingId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccionar edificio</option>
                                {buildings?.map(b => (
                                    <option key={b.id} value={b.id}>{b.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Capacidad *</label>
                            <input 
                                name="capacity"
                                type="number"
                                value={formData.capacity}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                            <label>Descripción</label>
                            <textarea 
                                name="description"
                                rows="4"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className={styles.scheduleSection}>
                        <div className={styles.scheduleHeader}>
                            <h3>Horarios configurados</h3>
                            <button type="button" className={styles.addButton}>
                                <FiPlus /> Agregar
                            </button>
                        </div>
                        
                        {formData.availabilitySlots?.length > 0 ? (
                            formData.availabilitySlots.map((slot, index) => (
                                <div key={index} className={styles.scheduleItem}>
                                    <div>
                                        <div className={styles.dayLabel}>{slot.daysOfWeek.join(', ')}</div>
                                        <div className={styles.timeLabel}>{slot.startTime} - {slot.endTime}</div>
                                    </div>
                                    <button type="button" className={styles.deleteBtn}>
                                        <FiTrash2 size={18} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p style={{ fontSize: '14px', color: '#6b7280', textAlign: 'center' }}>No hay horarios configurados.</p>
                        )}
                    </div>

                    <div className={styles.restrictionSection}>
                        <span className={styles.restrictionLabel}>Restringido para estudiantes</span>
                        <label className={styles.switch}>
                            <input 
                                type="checkbox"
                                name="availableForStudents"
                                checked={!formData.availableForStudents}
                                onChange={(e) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        availableForStudents: !e.target.checked
                                    }));
                                }}
                            />
                            <span className={styles.slider}></span>
                        </label>
                    </div>

                    {mutation.isError && (
                        <Alert severity="error" sx={{ mt: 2 }}>{mutation.error.message}</Alert>
                    )}

                    <div className={styles.footer}>
                        <button type="button" className={styles.cancelBtn} onClick={() => navigate("/spaces")}>
                            Cancelar
                        </button>
                        <button type="submit" className={styles.saveBtn} disabled={mutation.isPending}>
                            {mutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditSpace;
