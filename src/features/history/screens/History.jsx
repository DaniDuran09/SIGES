import styles from "../styles/History.module.css";
import tableStyles from "../styles/HistoryData.module.css";
import { FiSearch } from "react-icons/fi";

function History({ historyData }) {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h4>Gestión</h4>
                <h1>Historial</h1>

                <div className={styles.searchBar}>
                    <div className={styles.searchContainer}>
                        <FiSearch className={styles.searchIcon} />
                        <input
                            className={styles.search}
                            type="search"
                            placeholder="Buscar en historial..."
                        />
                    </div>

                    <div className={styles.componentSearch}>
                        <input className={styles.date} type="datetime-local" />

                        <div className={styles.optionAndState}>
                            <select className={styles.state}>
                                <option value="">Estado: Todos</option>
                                <option value="completada">Completada</option>
                                <option value="cancelada">Cancelada</option>
                                <option value="denegada">Denegada</option>
                            </select>

                            <select className={styles.sort}>
                                <option value="">Ordenar por</option>
                                <option value="fecha">Fecha</option>
                                <option value="nombre">Nombre</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className={tableStyles.wrapper}>
                    <table className={tableStyles.table}>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Recurso</th>
                            <th>Fecha de solicitud</th>
                            <th>Fecha de uso</th>
                            <th>Estatus</th>
                            <th>Resuelto por</th>
                        </tr>
                        </thead>

                        <tbody>
                        {historyData?.length > 0 ? (
                            historyData.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td className={tableStyles.name}>{item.name}</td>
                                    <td>{item.resource}</td>
                                    <td>{item.requestDate}</td>
                                    <td>{item.useDate}</td>
                                    <td>
                                            <span className={`${tableStyles.badge} ${tableStyles[item.status]}`}>
                                                {item.status}
                                            </span>
                                    </td>
                                    <td className={tableStyles.resolved}>{item.resolvedBy}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                                    No hay historial disponible
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default History;