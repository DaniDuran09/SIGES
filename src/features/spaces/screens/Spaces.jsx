import { FiEye, FiEdit2, FiRefreshCw } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Spaces.module.css";
import tableStyles from "../styles/SpacesData.module.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../../api/client.js";
import { useState } from "react";
import LoaderCircle from "../../../assets/components/LoaderCircle.jsx";
import Pagination from "../../../assets/components/Pagination";
import PlusButton from "../../../assets/components/PlusButton.jsx";
import SearchBar from "../../../assets/components/SearchBar.jsx";
import Filter from "../../../assets/components/Filter.jsx";
import { NewSpaceModal } from "../components/NewSpaceModal";
import { Alert } from "@mui/material";

function Spaces() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [searchSpace, setSearchSpace] = useState('');
    const [state, setState] = useState('');
    const [type, setType] = useState('');
    const [page, setPage] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);

    const statusOptions = [
        { value: "ALL", text: "Estado: Todos" },
        { value: "ACTIVE", text: "Activo" },
        { value: "INACTIVE", text: "Inactivo" },
    ];

    const { data: b_types } = useQuery({
        queryKey: ["GetTypeSpaces"],
        queryFn: () => apiFetch("/space-types", { method: "GET" }),
    });

    const typeOptions = [
        { value: "", text: "Tipo: Todos" },
        ...(b_types?.map((t) => ({
            value: t.id.toString(),
            text: t.name,
        })) || []),
    ];

    const queryKey = ["GetSpaces", searchSpace, state, type, page];

    const {
        data: b_spaces,
        isPending: b_spacesIsPending,
        error: b_spacesIsError,
        refetch
    } = useQuery({
        queryKey: queryKey,
        queryFn: () =>
            apiFetch("/spaces", {
                method: "GET",
                params: {
                    q: searchSpace,
                    showMode: state,
                    spaceTypeId: type,
                    page: page,
                    size: 20
                },
            }),
        retry: (failureCount, error) => error.status !== 404,
    });

    const toggleSpaceMutation = useMutation({
        mutationFn: async ({ id, currentlyActive }) => {
            const cleanId = String(id).trim();
            const action = currentlyActive ? "deactivate" : "activate";
            const endpoint = `/spaces/${cleanId}/${action}`;

            return apiFetch(endpoint, {
                method: "PATCH",
                headers: {
                    'X-API-Version': '1.0.0'
                }
            });
        },
        onMutate: async ({ id }) => {
            await queryClient.cancelQueries({ queryKey });
            const previousData = queryClient.getQueryData(queryKey);

            queryClient.setQueryData(queryKey, (old) => {
                if (!old) return old;
                return {
                    ...old,
                    content: old.content.map((space) =>
                        space.id === id
                            ? { ...space, deletedAt: space.deletedAt ? null : new Date().toISOString() }
                            : space
                    ),
                };
            });

            return { previousData };
        },
        onError: (err, variables, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(queryKey, context.previousData);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
        }
    });

    const handleToggleActive = (space) => {
        const isActive = space.deletedAt === null;
        toggleSpaceMutation.mutate({
            id: space.id,
            currentlyActive: isActive
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h4>Gestión</h4>
                {modalVisible && <NewSpaceModal onClose={() => setModalVisible(false)} />}
                <div className={styles.headerRow}>
                    <h1>Espacios</h1>
                    <PlusButton
                        text="Nuevo Espacio"
                        onClick={() => setModalVisible(true)}
                    />
                </div>

                <div className={styles.searchBar}>
                    <SearchBar
                        type="search"
                        placeholder="Buscar Espacios..."
                        value={searchSpace}
                        onChange={(e) => {
                            setSearchSpace(e.target.value);
                            setPage(0);
                        }}
                    />

                    <div className={styles.componentSearch}>
                        <div className={styles.optionAndState}>
                            <button
                                className={styles.refreshIcon}
                                title="Refrescar"
                                onClick={() => refetch()}
                            >
                                <FiRefreshCw />
                            </button>

                            <Filter
                                label="Tipo:"
                                value={type}
                                onChange={(e) => {
                                    setType(e.target.value);
                                    setPage(0);
                                }}
                                options={typeOptions}
                            />

                            <Filter
                                label="Estado:"
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
            </div>

            {b_spacesIsPending ? (
                    <LoaderCircle />
                ) :
                b_spacesIsError ? (<Alert severity={"error"}>Hubo un error al cargar los espacios</Alert>) : (
                    <div className={tableStyles.wrapper}>
                        <table className={tableStyles.table}>
                            <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Tipo</th>
                                <th>Edificio</th>
                                <th>Capacidad</th>
                                <th>Estudiantes</th>
                                <th>Estado</th>
                                <th>Activo</th>
                                <th>Acciones</th>
                            </tr>
                            </thead>

                            <tbody>
                            {b_spaces?.content?.length > 0 ? (
                                b_spaces.content.map((space) => (
                                    <tr key={space.id}>
                                        <td className={tableStyles.projectName}>{space.name}</td>
                                        <td>{space.spaceType?.name || '—'}</td>
                                        <td>{space.building?.name || '—'}</td>
                                        <td>{space.capacity ?? '—'}</td>
                                        <td>
                                                <span className={space.availableForStudents ? tableStyles.AbiertoText : tableStyles.RestringidoText}>
                                                    {space.availableForStudents ? "Abierto" : "Restringido"}
                                                </span>
                                        </td>
                                        <td>
                                                <span className={`${tableStyles.badge} ${space.deletedAt !== null ? tableStyles.INACTIVE : tableStyles[space.status]}`}>
                                                    {space.deletedAt !== null
                                                        ? "Inactivo"
                                                        : space.status === "AVAILABLE" ? "Disponible" : space.status === "IN_USE" ? "En uso" : "Mantenimiento"}
                                                </span>
                                        </td>
                                        <td>
                                            <label className={tableStyles.switch} onClick={(e) => e.stopPropagation()}>
                                                <input
                                                    type="checkbox"
                                                    checked={space.deletedAt === null}
                                                    onChange={() => handleToggleActive(space)}
                                                    disabled={toggleSpaceMutation.isPending}
                                                />
                                                <span className={tableStyles.slider}></span>
                                            </label>
                                        </td>
                                        <td className={tableStyles.actions}>
                                            <button
                                                className={tableStyles.iconButton}
                                                onClick={() => navigate(`/spaces/${space.id}`)}
                                                title="Ver detalle"
                                            >
                                                <FiEye size={18} />
                                            </button>
                                            <button
                                                className={tableStyles.iconButton}
                                                onClick={() => navigate(`/spaces/edit/${space.id}`)}
                                                title="Editar espacio"
                                            >
                                                <FiEdit2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: "center", padding: "40px", color: "#64748B" }}>
                                        No se encontraron registros
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>

                        <Pagination
                            currentPage={page}
                            totalPages={b_spaces?.totalPages || 0}
                            onPageChange={(newPage) => setPage(newPage)}
                        />
                    </div>
                )}
        </div>
    );
}

export default Spaces;