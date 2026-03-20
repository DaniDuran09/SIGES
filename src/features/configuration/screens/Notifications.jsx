import { useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import styles from "../../configuration/styles/Notifications.module.css";

function Notifications() {
    const navigate = useNavigate();

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
                    <h2>Notificaciones</h2>
                </div>

                <div className={styles.table}>

                    <div className={styles.tableHeader}>
                        <span></span>
                        <span>Email</span>
                        <span>In app</span>
                    </div>

                    <div className={styles.row}>
                        <span>Recurso en mantenimiento</span>
                        <label className={styles.switch}><input type="checkbox" defaultChecked /><span></span></label>
                        <label className={styles.switch}><input type="checkbox" defaultChecked /><span></span></label>
                    </div>

                    <div className={styles.row}>
                        <span>Recurso disponible tras mantenimiento</span>
                        <label className={styles.switch}><input type="checkbox" defaultChecked /><span></span></label>
                        <label className={styles.switch}><input type="checkbox" defaultChecked /><span></span></label>
                    </div>

                    <div className={styles.row}>
                        <span>Recurso dado de baja con reservas activas</span>
                        <label className={styles.switch}><input type="checkbox" defaultChecked /><span></span></label>
                        <label className={styles.switch}><input type="checkbox" defaultChecked /><span></span></label>
                    </div>

                    <div className={styles.row}>
                        <span>Reserva cancelada por aplicante</span>
                        <label className={styles.switch}><input type="checkbox" defaultChecked /><span></span></label>
                        <label className={styles.switch}><input type="checkbox" defaultChecked /><span></span></label>
                    </div>

                    <div className={styles.row}>
                        <span>Reserva aprobada</span>
                        <label className={styles.switch}><input type="checkbox" /><span></span></label>
                        <label className={styles.switch}><input type="checkbox" defaultChecked /><span></span></label>
                    </div>

                    <div className={styles.row}>
                        <span>Reserva aprobada</span>
                        <label className={styles.switch}><input type="checkbox" defaultChecked /><span></span></label>
                        <label className={styles.switch}><input type="checkbox" defaultChecked /><span></span></label>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default Notifications;