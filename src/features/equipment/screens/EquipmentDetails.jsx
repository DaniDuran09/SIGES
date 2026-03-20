import styles from "../styles/EquipmentDetails.module.css";
import { FiArrowLeft } from "react-icons/fi";

function EquipmentDetail() {

    return (
        <div className={styles.container}>

            <div className={styles.header}>
                <h4>Gestión</h4>
                <h1>Equipos</h1>
            </div>

            <button className={styles.backButton}>
                <FiArrowLeft />
                Volver
            </button>

            <div className={styles.card}>


            </div>
        </div>
    );
}

export default EquipmentDetail;