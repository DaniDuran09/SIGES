import styles from "../../configuration/styles/Configuration.module.css";
import { FiBell, FiLogOut, FiUser } from "react-icons/fi";
import { RiLockPasswordLine } from "react-icons/ri";

function Configuration() {
    return (
        <div className={styles.container}>

            <div className={styles.header}>

                <h4>Gestión</h4>
                <h1>Configuración</h1>

            </div>

            <div className={styles.cards}>

                <div className={styles.card}>

                    <div className={`${styles.icon} ${styles.purple}`}>
                        <FiUser />
                    </div>

                    <div>

                        <h3>Mi Perfil</h3>
                        <p>Ver y editar datos personales</p>

                    </div>

                </div>

                <div className={styles.card}>

                    <div className={`${styles.icon} ${styles.green}`}>
                        <FiBell />
                    </div>

                    <div>

                        <h3>Notificaciones</h3>
                        <p>Configurar alertas y push</p>

                    </div>

                </div>

                <div className={styles.card}>

                    <div className={`${styles.icon} ${styles.purpleLight}`}>
                        <RiLockPasswordLine />
                    </div>

                    <div>

                        <h3>Cambiar contraseña</h3>
                        <p>Actualizar credenciales</p>

                    </div>

                </div>

                <div className={styles.card}>
                    <div className={`${styles.icon} ${styles.red}`}>
                        <FiLogOut />
                    </div>

                    <div>

                        <h3>Cerrar sesión</h3>
                        <p>Salir de la aplicación</p>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Configuration;