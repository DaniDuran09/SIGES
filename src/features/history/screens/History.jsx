import styles from "../styles/History.module.css"
import tableStyles from "../styles/HistoryData.module.css"
import { FiSearch } from "react-icons/fi";

const historyData = [
    {
        id: 1,
        name: 'Carlos Salgado Trujillo',
        resource: 'Centro de Computo',
        requestDate: '2026-02-10',
        useDate: '2026-02-12',
        status: 'completada',
        resolvedBy: 'Maria Lopez'
    },
    {
        id: 2,
        name: 'Kevin Arturo Porcayo Cervantes',
        resource: 'Proyector',
        requestDate: '2026-02-08',
        useDate: '2026-02-09',
        status: 'completada',
        resolvedBy: 'Juan Perez'
    },
    {
        id: 3,
        name: 'Yahir Fuentes Martinez',
        resource: 'Biblioteca',
        requestDate: '2026-02-05',
        useDate: '2026-02-07',
        status: 'cancelada',
        resolvedBy: 'Ana Martinez'
    },
    {
        id: 4,
        name: 'Daniel Duran Torres',
        resource: 'HDMI Cable',
        requestDate: '2026-02-01',
        useDate: '2026-02-03',
        status: 'completada',
        resolvedBy: 'Luis Hernandez'
    },
    {
        id: 5,
        name: 'Carlos Salgado Trujillo',
        resource: 'Bocina',
        requestDate: '2026-01-28',
        useDate: '2026-01-30',
        status: 'denegada',
        resolvedBy: 'Sofia Ramirez'
    },
]

function History() {
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
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
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
                        {historyData.map((item) => (
                            <tr key={item.id}>
                                <td>#{item.id}</td>
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
                        ))}
                        </tbody>

                    </table>
                </div>

            </div>

        </div>
    )
}

export default History;