import styles from "../styles/Users.module.css";
import tableStyles from "../styles/UsersData.module.css";
import { FiPlus, FiSearch } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../../api/client";
import LoaderCircle from "../../../assets/components/LoaderCircle";
import { useState } from "react";
import NewUserModal from "../components/NewUserModal";
import { Alert } from "@mui/material";
import Pagination from "../../../assets/components/Pagination";
import PlusButton from "../../../assets/components/PlusButton.jsx";

function Users() {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [state, setState] = useState("ALL");
    const [type, setType] = useState("");
    const [page, setPage] = useState(0);

    const handleSetType = (type) => {
        setType(type);
    };

    const {
        data: b_users,
        isLoading: b_usersIsLoading,
        isError: b_usersIsError,
    } = useQuery({
        queryKey: ["GetUsers", type, state, search, page],
        queryFn: () =>
            apiFetch("/users", {
                method: "GET",
                params: {
                    showMode: state,
                    sort: ['firstName,asc', 'lastName,asc'],
                    userTypes: type,
                    search: search,
                    page: page,
                    size: 20
                },
            }),
        retry: (failureCount, error) => error.status !== 404,
    });

    if (b_usersIsError && b_usersIsError.status !== 404) {
        return (
            <div className={styles.container}>
                <Alert severity="error">Error al cargar los usuarios: {b_usersIsError.message}</Alert>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {open && <NewUserModal onClose={() => setOpen(false)} />}

            <div className={styles.header}>
                <h4>Gestión</h4>

                <div className={styles.headerRow}>
                    <h1>Usuarios</h1>

                    <PlusButton
                        text="Nuevo Usuario"
                        onClick={() => setOpen(true)}
                    />
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
                <>
                    <div className={tableStyles.wrapper}>
                        <table className={tableStyles.table}>
                            <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Tipo</th>
                                <th>Matrícula</th>
                                <th>Correo</th>
                                <th>Teléfono</th>
                                <th>Estado</th>
                            </tr>
                            </thead>

                            <tbody>
                            {b_users?.content?.length > 0 ? (
                                b_users.content.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.firstName + " " + user.lastName}</td>

                                        <td>
                                                <span
                                                    className={`${tableStyles.badge} ${
                                                        user.role === "ADMIN"
                                                            ? tableStyles.ADMIN
                                                            : user.role === "STUDENT"
                                                                ? tableStyles.STUDENT
                                                                : tableStyles.INSTITUTIONAL_STAFF
                                                    }`}
                                                >
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
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                                        No se encontraron registros
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                    <Pagination 
                        currentPage={page} 
                        totalPages={b_users?.totalPages || 0} 
                        onPageChange={(newPage) => setPage(newPage)} 
                    />
                </>
            )}
        </div>
    );
}

export default Users;