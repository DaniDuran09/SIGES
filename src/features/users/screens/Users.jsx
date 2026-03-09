import styles from "../styles/Users.module.css"
import tableStyles from "../styles/UsersData.module.css"
import { FiPlus, FiSearch } from "react-icons/fi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../../api/client";
import LoaderCircle from "../../../assets/components/LoaderCircle";
import { useEffect, useState } from "react";
import NewUserModal from "../components/NewUserModal";
import { Alert } from "@mui/material";

function Users() {

    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [state, setState] = useState("ALL");
    const [type, setType] = useState("");

    const queryClient = useQueryClient();

    const handleSetType = (type) => {
        setType(type);
    }

    const { data: b_users, isLoading: b_usersIsLoading, isError: b_usersIsError } = useQuery({
        queryKey: ["GetUsers", type, state, search],
        queryFn: () => apiFetch("/users", {
            method: "GET",
            params: {
                showMode: state,
                sort: [
                    'firstName,asc',
                    'lastName,asc'
                ],
                userTypes: type,
                search: search
            }
        }),
    });

    if (b_usersIsError) {
        return <Alert severity="error">Error al cargar los usuarios</Alert>;
    }

    return (

        <div className={styles.container}>
            {open && <NewUserModal onClose={() => setOpen(false)} />}
            <div className={styles.header}>

                <h4>
                    Gestión
                </h4>

                <div className={styles.headerRow}>
                    <h1>
                        Usuarios
                    </h1>

                    <button className={styles.newRequestButton} onClick={() => setOpen(true)} >

                        <FiPlus style={{ width: '25px', height: '25px', color: 'white' }} />
                        <h3 className={styles.newRequestText}>
                            Nuevo Usuario
                        </h3>

                    </button>

                </div>

                <div className={styles.tabs}>
                    <button className={type === "" ? styles.active : ""} onClick={() => handleSetType("")}>Todas</button>
                    <button className={type === "ADMIN" ? styles.active : ""} onClick={() => handleSetType("ADMIN")}>Administrador</button>
                    <button className={type === "PERSONAL_STAFF" ? styles.active : ""} onClick={() => handleSetType("PERSONAL_STAFF")}>Personal / Staff</button>
                    <button className={type === "STUDENT" ? styles.active : ""} onClick={() => handleSetType("STUDENT")}>Estudiantes</button>
                </div>

                <div className={styles.searchBar}>

                    <div className={styles.searchContainer}>

                        <FiSearch className={styles.searchIcon} />
                        <input
                            className={styles.search}
                            type="search"
                            placeholder="Buscar Usuario..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                    </div>

                    <div className={styles.componentSearch}>

                        <div className={styles.optionAndState}>
                            <select
                                className={styles.state}
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                            >
                                <option value="ALL">Estado: Todos</option>
                                <option value="ACTIVE">Activo</option>
                                <option value="INACTIVE">Inactivo</option>
                            </select>
                        </div>

                    </div>

                </div>

            </div>

            <div className={tableStyles.wrapper}>

                {!b_usersIsLoading ? (
                    <table className={tableStyles.table}>

                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Tipo</th>
                                <th>Matricula/No. Empleado</th>
                                <th>correo</th>
                                <th>Telefono</th>
                                <th>Estatus</th>
                            </tr>
                        </thead>

                        <tbody>
                            {b_users?.content?.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: "center", padding: "20px" }}>
                                        No hay usuarios para mostrar
                                    </td>
                                </tr>
                            ) : (
                                b_users?.content.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.firstName + " " + user.lastName}</td>

                                        <td>
                                            <span className={`${tableStyles.badge} ${tableStyles[user.role]}`}>
                                                {user.role === "ADMIN"
                                                    ? "Administrador"
                                                    : user.role === "STUDENT"
                                                        ? "Estudiante"
                                                        : "Personal"}
                                            </span>
                                        </td>

                                        <td>{user.registrationNumber || user.employeeNumber || 'No Aplica'}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phoneNumber}</td>

                                        <td>
                                            <span
                                                className={`${tableStyles.badge} ${tableStyles[user.enabled ? "active" : "inactive"]
                                                    }`}
                                            >
                                                {user.enabled ? "Activo" : "Inactivo"}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>

                    </table>
                ) : (
                    <LoaderCircle />
                )}


            </div>

        </div>
    )
}

export default Users;