import { FiPlus, FiSearch } from "react-icons/fi";
import styles from "../styles/Equipment.module.css";
import tableStyles from "../styles/EquipmentData.module.css";

const equipmentsData = [
    {
        name: 'Proyector HDMI',
        type: 'Proyector',
        inventory: 'INV-2026-001',
        space: 'Auditorio Principal',
        students: 'Abierto',
        status: 'disponible',
        actions: 'Detalles'
    },
    {
        name: 'Cable HDMI x2',
        type: 'Cable',
        inventory: 'INV-2026-010',
        space: '—',
        students: 'Abierto',
        status: 'disponible',
        actions: 'Detalles'
    },
    {
        name: 'Router Wifi Industrial',
        type: 'Router',
        inventory: 'INV-2026-025',
        space: 'Lab de Cómputo 1',
        students: 'Restringido',
        status: 'enUso',
        actions: 'Detalles'
    },
    {
        name: 'Pantalla Interactiva',
        type: 'Pantalla',
        inventory: 'INV-2026-040',
        space: 'Sala de Juntas A',
        students: 'Abierto',
        status: 'disponible',
        actions: 'Detalles'
    },
    {
        name: 'Extensión 3 m',
        type: 'Extensión',
        inventory: 'INV-2026-055',
        space: '—',
        students: 'Abierto',
        status: 'mantenimiento',
        actions: 'Detalles'
    }
];

function Equipments() {
    return (
        <div className={styles.container}>

            <div className={styles.header}>

                <h4>Gestión</h4>

                <div className={styles.headerRow}>
                    <h1>Equipos</h1>

                    <button className={styles.newRequestButton}>
                        <FiPlus style={{ width: '25px', height: '25px', color: 'white' }} />
                        <h3 className={styles.newRequestText}>
                            Nuevo Equipo
                        </h3>
                    </button>
                </div>

                <div className={styles.searchBar}>

                    <div className={styles.searchContainer}>
                        <FiSearch className={styles.searchIcon} />
                        <input
                            className={styles.search}
                            type="search"
                            placeholder="Buscar equipo..."
                        />
                    </div>

                    <div className={styles.componentSearch}>
                        <div className={styles.optionAndState}>
                            <select className={styles.state}>
                                <option value="">Tipo: Todos</option>
                                <option value="Proyector">Proyector</option>
                            </select>

                            <select className={styles.sort}>
                                <option value="">Estado: Todos</option>
                                <option value="disponible">Disponible</option>
                            </select>
                        </div>
                    </div>

                </div>

            </div>

            <div className={tableStyles.wrapper}>
                <table className={tableStyles.table}>

                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Inventory No.</th>
                        <th>Associated Space</th>
                        <th>Students</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {equipmentsData.map((equipment, index) => (
                        <tr key={index}>
                            <td>{equipment.name}</td>
                            <td>{equipment.type}</td>
                            <td>{equipment.inventory}</td>
                            <td>{equipment.space}</td>

                            <td>
                                    <span className={`${tableStyles.badge} ${tableStyles[equipment.students]}`}>
                                        {equipment.students}
                                    </span>
                            </td>

                            <td>
                                    <span className={`${tableStyles.badge} ${tableStyles[equipment.status]}`}>
                                        {equipment.status}
                                    </span>
                            </td>

                            <td>
                                <button className={tableStyles.detailsButton}>
                                    {equipment.actions}
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>

                </table>
            </div>

        </div>
    );
}

export default Equipments;