import styles from "../styles/Users.module.css";
import tableStyles from "../styles/UsersData.module.css";
import { FiPlus, FiSearch } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../../api/client";
import LoaderCircle from "../../../assets/components/LoaderCircle";
import { useState } from "react";
import NewUserModal from "../components/NewUserModal";
import { Alert } from "@mui/material";

function Users() {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [state, setState] = useState("ALL");
    const [type, setType] = useState("");

    const handleSetType = (type) => {
        setType(type);
    };

    const {
        data: b_users,
        isLoading: b_usersIsLoading,
        isError: b_usersIsError,
    } = useQuery({
        queryKey: ["GetUsers", type, state, search],
        queryFn: () =>
            apiFetch("/users", {
                method: "GET",
                params: {
                    showMode: state,
                    sort: ['firstName,asc', 'lastName,asc'],
                    userTypes: type,
                    search: search,
                },
            }),
    });

    if (b_usersIsError) {
        return <Alert severity="error">Error al cargar los usuarios</Alert>;
    }

    return (
        <div className={styles.container}>
            {open && <NewUserModal onClose={() => setOpen(false)} />}

            <div className={styles.header}>
                <h4>Gestión</h4>

                <div className={styles.headerRow}>
                    <h1>Usuarios</h1>

                    <button className={styles.newRequestButton} onClick={() => setOpen(true)}>
                        <FiPlus style={{ width: '25px', height: '25px', color: 'white' }} />
                        <h3 className={styles.newRequestText}>
                            Nuevo Usuario
                        </h3>
                    </button>
                </div>

                <div className={styles.tabs}>
                    <button className={type === "" ? styles.active : ""} onClick={() => handleSetType("")}>Todas</button>
                    <button className={type === "ADMIN" ? styles.active : ""} onClick={() => handleSetType("ADMIN")}>Administrador</button>
                    <button className={type === "INSTITUTIONAL_STAFF" ? styles.active : ""} onClick={() => handleSetType("INSTITUTIONAL_STAFF")}>Personal / Staff</button>
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

            {b_usersIsLoading ? (
                <LoaderCircle />
            ) : (
                <div className={tableStyles.wrapper}>
                    {!b_users?.content || b_users.content.length === 0 ? (
                        <div className={tableStyles.empty}>
                            <p>No hay usuarios registrados</p>
                        </div>
                    ) : (
                        <table className={tableStyles.table}>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Tipo</th>
                                    <th>Matrícula / No. Empleado</th>
                                    <th>Correo</th>
                                    <th>Teléfono</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>

                            <tbody>
                                {b_users.content.map((user) => (
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

                                        <td>{user.registrationNumber || user.employeeNumber || '—'}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phoneNumber}</td>

                                        <td>
                                            <label className={tableStyles.switch}>
                                                <input
                                                    type="checkbox"
                                                    checked={user.enabled ?? user.active}
                                                    readOnly
                                                />
                                                <span className={tableStyles.slider}></span>
                                            </label>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}

export default Users;