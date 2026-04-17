import styles from "../styles/Users.module.css";
import tableStyles from "../styles/UsersData.module.css";
import { FiRefreshCw, FiEye } from "react-icons/fi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../../api/client";
import LoaderCircle from "../../../assets/components/LoaderCircle";
import { useState, useEffect, useRef } from "react";
import NewUserModal from "../components/NewUserModal";
import { Alert } from "@mui/material";
import Pagination from "../../../assets/components/Pagination";
import PlusButton from "../../../assets/components/PlusButton.jsx";
import SearchBar from "../../../assets/components/SearchBar.jsx";
import Filter from "../../../assets/components/Filter.jsx";
import { useNavigate } from "react-router-dom";

function Users() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [state, setState] = useState("ALL");
    const [type, setType] = useState("");
    const [page, setPage] = useState(0);

    const statusOptions = [
        { value: "ALL", text: "Estado: Todos" },
        { value: "ACTIVE", text: "Activo" },
        { value: "INACTIVE", text: "Inactivo" }
    ];

    const queryKey = ["GetUsers", type, state, search, page];

    const {
        data: b_users,
        isLoading: b_usersIsLoading,
        isError: b_usersIsError,
        refetch
    } = useQuery({
        queryKey: queryKey,
        queryFn: () => {
            const params = {
                showMode: state,
                sort: ['firstName,asc', 'lastName,asc'],
                userTypes: type,
                page: page,
                size: 20
            };
            if (search) params.q = search;

            return apiFetch("/users", {
                method: "GET",
                params: params,
            });
        },
        retry: (failureCount, error) => error.status !== 404,
    });
    const itemCache = useRef({});

    useEffect(() => {
        // Si cambian los filtros (excepto página y búsqueda), reseteamos el caché
        // porque el ID artificial (#1, #2...) cambia su significado.
        if (!search) {
            const isFirstLoadOfFilters = !b_users?.content;
            if (isFirstLoadOfFilters) return;

            // Si cambiamos de filtro (pero no de página), reseteamos el caché para evitar mezclar
            // Nota: Podríamos ser más precisos detectando qué cambió, pero resetear al cambiar filtros es más seguro.
        }
    }, [state, type]);

    useEffect(() => {
        if (!search && b_users?.content) {
            const newCache = { ...itemCache.current };
            b_users.content.forEach((user, index) => {
                const artificialId = (page * 20) + index + 1;
                newCache[artificialId] = { ...user, _artificialId: artificialId };
            });
            itemCache.current = newCache;
        }
    }, [b_users, search, page, state, type]);

    // Reseteo preventivo del caché cuando cambian filtros base
    useEffect(() => {
        itemCache.current = {};
    }, [state, type]);

    let displayUsers = b_users?.content || [];

    if (search && /^\d+$/.test(search.trim())) {
        const artificialId = parseInt(search.trim());
        const cachedItem = itemCache.current[artificialId];
        if (cachedItem && !displayUsers.some(u => u.id === cachedItem.id)) {
            displayUsers = [cachedItem, ...displayUsers];
        }
    }
    const toggleUserMutation = useMutation({
        mutationFn: async ({ id, currentlyActive }) => {
            const endpoint = currentlyActive ? `/users/${id}` : `/users/${id}/restore`;
            const method = currentlyActive ? "DELETE" : "PATCH";
            return apiFetch(endpoint, { method });
        },
        onMutate: async ({ id }) => {
            await queryClient.cancelQueries({ queryKey });
            const previousUsers = queryClient.getQueryData(queryKey);

            queryClient.setQueryData(queryKey, (old) => {
                if (!old) return old;
                return {
                    ...old,
                    content: old.content.map((user) =>
                        user.id === id
                            ? { ...user, enabled: !user.enabled, active: !user.active }
                            : user
                    ),
                };
            });

            return { previousUsers };
        },
        onError: (err, variables, context) => {
            if (context?.previousUsers) {
                queryClient.setQueryData(queryKey, context.previousUsers);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["GetUsers"] });
        },
    });

    const handleSetType = (newType) => {
        setType(newType);
        setPage(0);
    };

    const handleToggleActive = (e, user) => {
        e.stopPropagation();
        const isActive = user.enabled ?? user.active ?? true;
        toggleUserMutation.mutate({
            id: user.id,
            currentlyActive: isActive
        });
    };

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
                    <PlusButton text="Nuevo Usuario" onClick={() => setOpen(true)} />
                </div>

                <div className={styles.tabs}>
                    <button className={type === "" ? styles.active : ""} onClick={() => handleSetType("")}>Todas</button>
                    <button className={type === "ADMIN" ? styles.active : ""} onClick={() => handleSetType("ADMIN")}>Administrador</button>
                    <button className={type === "INSTITUTIONAL_STAFF" ? styles.active : ""} onClick={() => handleSetType("INSTITUTIONAL_STAFF")}>Personal / Staff</button>
                    <button className={type === "STUDENT" ? styles.active : ""} onClick={() => handleSetType("STUDENT")}>Estudiantes</button>
                </div>

                <div className={styles.searchBar}>
                    <SearchBar
                        type="search"
                        placeholder="Buscar Usuario..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(0);
                        }}
                    />

                    <div className={styles.filterGroup}>
                        <button className={styles.refreshIcon} title="Refrescar" onClick={() => refetch()}>
                            <FiRefreshCw />
                        </button>
                        <Filter
                            value={state}
                            onChange={(e) => {
                                setState(e.target.value);
                                setPage(0);
                            }}
                            options={statusOptions}
                        />
                    </div>
                </div>
            </div>

            {b_usersIsLoading ? (
                <LoaderCircle />
            ) : (
                <>
                    <div className={tableStyles.wrapper}>
                        <div className={tableStyles.tableContainer}>
                            <table className={tableStyles.table}>
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: "center", width: "50px" }}>#</th>
                                        <th>Nombre y apellido</th>
                                        <th>Tipo</th>
                                        <th>Matrícula/N.°Empleado</th>
                                        <th>Correo</th>
                                        <th>Teléfono</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayUsers.length > 0 ? (
                                        displayUsers.map((user, index) => (
                                            <tr key={user.id} onClick={() => navigate(`/users/edit/${user.id}`)} style={{ cursor: "pointer" }}>
                                                <td style={{ textAlign: 'center', color: '#6B7280', fontWeight: 'bold' }}>
                                                    {user._artificialId || (page * 20) + index + 1}
                                                </td>
                                                <td className={tableStyles.projectName}>{user.firstName + " " + user.lastName}</td>
                                                <td>
                                                    <span className={`${tableStyles.badge} ${tableStyles[user.role]}`}>
                                                        {user.role === "ADMIN" ? "Administrador" : user.role === "STUDENT" ? "Estudiante" : "Personal"}
                                                    </span>
                                                </td>
                                                <td>{user.role === "ADMIN" ? "No aplica" : (user.registrationNumber || user.employeeNumber || '—')}</td>
                                                <td>{user.email}</td>
                                                <td>{user.phoneNumber || '—'}</td>
                                                <td>
                                                    <label className={tableStyles.switch} onClick={(e) => e.stopPropagation()}>
                                                        <input
                                                            type="checkbox"
                                                            checked={user.enabled ?? user.active ?? true}
                                                            onChange={(e) => handleToggleActive(e, user)}
                                                        />
                                                        <span className={tableStyles.slider}></span>
                                                    </label>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" style={{ textAlign: "center", padding: "40px", color: "#64748B" }}>
                                                No se encontraron registros
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
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