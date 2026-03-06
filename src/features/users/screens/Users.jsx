import styles from "../styles/Users.module.css"
import tableStyles from "../styles/UsersData.module.css"
import { FiPlus, FiSearch } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../../api/client";
import LoaderCircle from "../../../assets/components/LoaderCircle";

function Users() {
    const { data: b_users, isLoading: b_usersIsLoading, isError: b_usersIsError } = useQuery({
        queryKey: ["GetUsers"],
        queryFn: () => apiFetch("/users", {
            method: "GET",
        }),
    });
    if (b_usersIsLoading) {
        return <LoaderCircle />;
    }

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
                        {b_users?.content.map((user) => (
                            <tr key={user.id}>
                                <td>{user.firstName + " " + user.lastName}</td>

                                <td>
                                    <span className={`${tableStyles.badge} ${tableStyles[user.role]}`}>
                                        {user.role}
                                    </span>
                                </td>

                                <td>{user.registrationNumber}</td>
                                <td>{user.email}</td>
                                <td>{user.phoneNumber}</td>

                                <td>
                                    {/*
                                    <span className={`${tableStyles.badge} ${tableStyles[user.status]}`}
                                    >
                                        {user.status}
                                    </span>
                                */}

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