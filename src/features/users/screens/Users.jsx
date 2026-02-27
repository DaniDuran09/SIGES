import styles from "../styles/Users.module.css"
import tableStyles from "../styles/UsersData.module.css"
import { FiPlus, FiSearch } from "react-icons/fi";

const userData = [
    {
        name: 'Carlos Salgado Trujillo',
        type: 'personal',
        tuition: '20243DS008',
        mail: '20243ds008@utez.edu.mx',
        phone: 7773452574,
        status: 'activo'
    },
    {
        name: 'Kevin Arturo Porcayo Cervantes',
        type: 'estudiante',
        tuition: '20243DS154',
        mail: '20243ds154@utez.edu.mx',
        phone: 7773459386,
        status: 'activo'
    },
    {
        name: 'Yahir Fuentes Martinez',
        type: 'personal',
        tuition: '20243DS946',
        mail: '20243ds946@utez.edu.mx',
        phone: 7773574894,
        status: 'activo'
    },
    {
        name: 'Daniel Duran Torres',
        type: 'personal',
        tuition: '20243DS486',
        mail: '20243ds486@utez.edu.mx',
        phone: 7773653548,
        status: 'inactivo'
    },
    {
        name: 'Carlos Salgado Trujillo',
        type: 'personal',
        tuition: '20243DS009',
        mail: '20243ds009@utez.edu.mx',
        phone: 7774553621,
        status: 'inactivo'
    },
]

function Users() {

    return (

        <div className={styles.container}>

            <div className={styles.header}>

                <h4>
                    Gestión
                </h4>

                <div className={styles.headerRow}>
                    <h1>
                        Usuarios
                    </h1>

                    <button className={styles.newRequestButton}>

                        <FiPlus style={{ width: '25px', height: '25px', color: 'white' }} />
                        <h3 className={styles.newRequestText}>
                            Nuevo Usuario
                        </h3>

                    </button>

                </div>

                <div className={styles.tabs}>

                    <button className={styles.active}>Todas</button>
                    <button>Personal</button>
                    <button>Estudiantes</button>

                </div>

                <div className={styles.searchBar}>

                    <div className={styles.searchContainer}>

                        <FiSearch className={styles.searchIcon} />
                        <input
                            className={styles.search}
                            type="search"
                            placeholder="Buscar Usuario..."
                        />

                    </div>

                    <div className={styles.componentSearch}>

                        <input className={styles.date} type="datetime-local" />

                        <div className={styles.optionAndState}>
                            <select className={styles.state} id="opciones" name="estado" >
                                <option value="">Estado: Tipo</option>
                                <option value="activo">Activo</option>
                                <option value="inactivo">Inactivo</option>
                            </select>

                            <select className={styles.sort} id="opciones" name="tipo">
                                <option value="">Tipo: Todos</option>
                                <option value="personal">Personal</option>
                                <option value="estudiante">Estudiante</option>
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
                        <th>Matricula</th>
                        <th>correo</th>
                        <th>Telefono</th>
                        <th>Estatus</th>
                    </tr>
                    </thead>

                    <tbody>
                    {userData.map((user, index) => (
                        <tr key={index}>
                            <td>{user.name}</td>

                            <td>
                                    <span className={`${tableStyles.badge} ${tableStyles[user.type]}`}>
                                        {user.type}
                                    </span>
                            </td>

                            <td>{user.tuition}</td>
                            <td>{user.mail}</td>
                            <td>{user.phone}</td>

                            <td>
                                    <span className={`${tableStyles.badge} ${tableStyles[user.status]}`}>
                                        {user.status}
                                    </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>

                </table>

            </div>

        </div>
    )
}

export default Users;