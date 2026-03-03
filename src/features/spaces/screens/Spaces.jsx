import { FiPlus, FiSearch } from "react-icons/fi";
import styles from "../styles/Spaces.module.css";
import tableStyles from "../styles/SpacesData.module.css";

const spacesData = [
    {
        name: 'Auditorio Principal',
        type: 'Auditorio',
        location: 'Edificio A, Piso 1',
        capacity: 200,
        students: 'Restringido',
        status: 'disponible',
        actions: 'Detalles'
    },
    {
        name: 'Sala de Juntas A',
        type: 'Sala',
        location: 'Edificio B, Piso 2',
        capacity: 15,
        students: 'Abierto',
        status: 'disponible',
        actions: 'Detalles'
    },
    {
        name: 'Sala de Juntas B',
        type: 'Sala',
        location: 'Edificio B, Piso 2',
        capacity: 15,
        students: 'Abierto',
        status: 'enUso',
        actions: 'Detalles'
    },
    {
        name: 'Lab de Cómputo',
        type: 'Laboratorio',
        location: 'Edificio C, Piso 1',
        capacity: 30,
        students: 'Restringido',
        status: 'disponible',
        actions: 'Detalles'
    },
    {
        name: 'Sala Biblioteca',
        type: 'Sala',
        location: 'Biblioteca',
        capacity: 8,
        students: 'Abierto',
        status: 'mantenimiento',
        actions: 'Detalles'
    }
];

function Spaces() {
    return (
        <div className={styles.container}>

            <div className={styles.header}>

                <h4>Gestión</h4>

                <div className={styles.headerRow}>
                    <h1>Espacios</h1>

                    <button className={styles.newRequestButton}>
                        <FiPlus style={{ width: '25px', height: '25px', color: 'white' }} />
                        <h3 className={styles.newRequestText}>
                            Nuevo espacio
                        </h3>
                    </button>
                </div>

                <div className={styles.searchBar}>

                    <div className={styles.searchContainer}>
                        <FiSearch className={styles.searchIcon} />
                        <input
                            className={styles.search}
                            type="search"
                            placeholder="Buscar espacio..."
                        />
                    </div>

                    <div className={styles.componentSearch}>
                        <div className={styles.optionAndState}>
                            <select className={styles.state}>
                                <option value="">Tipo: Todos</option>
                                <option value="Auditorio">Auditorio</option>
                                <option value="Sala">Sala</option>
                                <option value="Laboratorio">Laboratorio</option>
                            </select>

                            <select className={styles.sort}>
                                <option value="">Estado: Todos</option>
                                <option value="disponible">Disponible</option>
                                <option value="enUso">En uso</option>
                                <option value="mantenimiento">Mantenimiento</option>
                            </select>
                        </div>
                    </div>

                </div>

            </div>

            <div className={tableStyles.wrapper}>
                <table className={tableStyles.table}>

                    <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Tipo</th>
                        <th>Ubicación</th>
                        <th>Capacidad</th>
                        <th>Estudiantes</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>

                    <tbody>
                    {spacesData.map((space, index) => (
                        <tr key={index}>
                            <td>{space.name}</td>

                            <td>{space.type}</td>

                            <td>{space.location}</td>

                            <td>{space.capacity}</td>

                            <td>
                                    <span className={`${tableStyles.badge} ${tableStyles[space.students]}`}>
                                        {space.students}
                                    </span>
                            </td>

                            <td>
                                    <span className={`${tableStyles.badge} ${tableStyles[space.status]}`}>
                                        {space.status}
                                    </span>
                            </td>

                            <td>
                                <button className={tableStyles.detailsButton}>
                                    {space.actions}
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

export default Spaces;