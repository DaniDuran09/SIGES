import { IoMdNotificationsOutline } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import styles from "../styles/Requests.module.css";
import tableStyles from "../styles/RequestsData.module.css";

const requestsData = [
    { usuario: 'Carlos Salgado Trujillo', recurso: 'Auditorio principal', fecha: '28 ene 2026', horario: '14:00 - 16:00', tipo: 'Espacio', estado: 'Pendiente', acciones: { aprobar: true, rechazar: true } },
    { usuario: 'Kevin Arturo Porcayo', recurso: 'Sala de Juntas B', fecha: '29 ene 2026', horario: '10:00 - 12:00', tipo: 'Espacio', estado: 'Pendiente', acciones: { aprobar: true, rechazar: true } },
    { usuario: 'Yahir Fuentes Martínez', recurso: 'Proyector HDMI x3', fecha: '30 ene 2026', horario: '09:00 - 13:00', tipo: 'Equipo', estado: 'Pendiente', acciones: { aprobar: true, rechazar: true } },
    { usuario: 'Daniel Duran Torres', recurso: 'Lab de Cómputo 3', fecha: '31 ene 2026', horario: '15:00 - 17:00', tipo: 'Espacio', estado: 'Aprobada', acciones: { aprobar: false, rechazar: false } },
    { usuario: 'José María Domínguez', recurso: 'Cable HDMI x2', fecha: '27 ene 2026', horario: '08:00 - 10:00', tipo: 'Equipo', estado: 'Denegada', acciones: { aprobar: false, rechazar: false } },
    { usuario: 'Carlos Salgado Trujillo', recurso: 'Sala de Biblioteca', fecha: '26 ene 2026', horario: '11:00 - 11:00', tipo: 'Espacio', estado: 'Completada', acciones: { aprobar: false, rechazar: false } }
];

function Requests() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h4>Gestión</h4>

                <div className={styles.topBar}>
                    <h1>Solicitudes</h1>
                    <button className={styles.notificationButton}>
                        {true && (
                            <div style={{ width: '15px', height: '15px', backgroundColor: '#FF9B85', borderRadius: '50%', position: 'absolute', top: '5px', right: '5px' }} />
                        )}
                        <IoMdNotificationsOutline style={{ width: '30px', height: '30px' }} />
                    </button>
                </div>

                <div className={styles.tabs}>
                    <button className={styles.active}>Todas</button>
                    <button>Pendientes</button>
                    <button>Aprobadas</button>
                    <button>Denegadas</button>
                </div>

                <div className={styles.searchBar}>
                    <div className={styles.searchContainer}>
                        <FiSearch className={styles.searchIcon} />
                        <input className={styles.search} type="search" placeholder="Buscar solicitudes..." />
                    </div>

                    <div className={styles.componentSearch}>
                        <div className={styles.optionAndState}>
                            <select className={styles.sort}>
                                <option value="">Tipo: Todos</option>
                                <option value="fecha">Fecha</option>
                                <option value="usuario">Usuario</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className={tableStyles.wrapper}>
                <table className={tableStyles.table}>
                    <thead>
                    <tr>
                        <th>Usuario</th>
                        <th>Recurso</th>
                        <th>Fecha</th>
                        <th>Horario</th>
                        <th>Tipo</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {requestsData.map((item, index) => (
                        <tr key={index}>
                            <td className={tableStyles.usuario}>{item.usuario}</td>
                            <td>{item.recurso}</td>
                            <td>{item.fecha}</td>
                            <td>{item.horario}</td>
                            <td>{item.tipo}</td>
                            <td>
                                    <span className={`${tableStyles.badge} ${tableStyles[item.estado.toLowerCase()]}`}>
                                        {item.estado}
                                    </span>
                            </td>
                            <td className={tableStyles.actions}>
                                {item.acciones.aprobar && (
                                    <button className={tableStyles.approve}>✓</button>
                                )}
                                {item.acciones.rechazar && (
                                    <button className={tableStyles.reject}>✕</button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Requests;