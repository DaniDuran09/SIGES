import styles from "../styles/Users.module.css"
import {FiPlus, FiSearch} from "react-icons/fi";

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

            <div className={styles.body}>
                hola

            </div>

        </div>
    )
}
export default Users;