import styles from "../styles/Users.module.css"
import {FiPlus, FiSearch} from "react-icons/fi";
import StatsComponent from "../../home/components/StatsComponent.jsx";
import UsersData from "../components/UsersData.jsx";

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
                            Nuevo Usuario</h3>

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
                            placeholder="Buscar Equipo..."
                        />

                    </div>

                    <div className={styles.componentSearch}>

                        <input className={styles.date} type="datetime-local" />

                        <div className={styles.optionAndState}>
                            <select className={styles.state} id="opciones" name="estado" >
                                <option value="">Estado: Tipo</option>
                                <option value="opcion1">1</option>
                                <option value="opcion2">0</option>
                            </select>

                            <select className={styles.sort} id="opciones" name="tipo">
                                <option value="">Tipo: Todos</option>
                                <option value="opcion1">Opción 1</option>
                                <option value="opcion2">Opción 2</option>
                                <option value="opcion3">Opción 3</option>
                            </select>
                        </div>

                    </div>

                </div>

            </div>

            <div className={styles.usersTable}>
                {userData.map((userData, index) => (
                    <UsersData key={index} props={userData} />
                ))}

            </div>

        </div>
    )
}
export default Users;