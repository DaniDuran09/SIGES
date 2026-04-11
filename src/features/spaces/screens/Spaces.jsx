import { FiEye, FiEdit2, FiRefreshCw } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Spaces.module.css";
import tableStyles from "../styles/SpacesData.module.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../../api/client.js";
import { useState, useEffect, useRef } from "react";
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
    const [showMode, setShowMode] = useState('ALL');
    const [status, setStatus] = useState('');
    const [type, setType] = useState('');
    const [page, setPage] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);

    const showModeOptions = [
        { value: "ALL", text: "Estado: Todos" },
        { value: "ACTIVE", text: "Activo" },
        { value: "INACTIVE", text: "Inactivo" },
    ];

    const statusOptions = [
        { value: "", text: "Disponibilidad: Todos" },
        { value: "AVAILABLE", text: "Disponible" },
        { value: "MAINTENANCE", text: "Mantenimiento" },
        { value: "LOANED", text: "En uso" }, // El backend usa LOANED tanto para equipos como espacios
    ];

    const { data: b_types } = useQuery({
        queryKey: ["GetTypeSpaces"],
        queryFn: () => apiFetch("/space-types", { method: "GET" }),
    });

    const typeOptions = [
        { value: "", text: "Tipo: Todos" },
        ...(b_types?.filter(t => t.deletedAt === null).map((t) => ({
            value: t.id.toString(),
            text: t.name,
        })) || []),
    ];

    const queryKey = ["GetSpaces", searchSpace, showMode, status, type, page];

    const itemCache = useRef({});

    useEffect(() => {
        if (!searchSpace && b_spaces?.content) {
            const newCache = { ...itemCache.current };
            // Obtenemos la lista que se muestra (con filtro local) para mapear los IDs correctamente
            const filteredContent = b_spaces.content.filter(space => {
                if (status === "") return true;
                if (status === "LOANED" && space.status === "IN_USE") return true;
                if (status === "IN_USE" && space.status === "LOANED") return true;
                return space.status === status;
            });

            filteredContent.forEach((item, index) => {
                const artificialId = (page * 20) + index + 1;
                newCache[artificialId] = { ...item, _artificialId: artificialId };
            });
            itemCache.current = newCache;
        }
    }, [b_spaces, searchSpace, page, status, type, showMode]);

    // Reseteo del caché cuando cambian filtros base
    useEffect(() => {
        itemCache.current = {};
    }, [status, type, showMode]);

    let displaySpaces = b_spaces?.content?.filter(space => {
        if (status === "") return true;
        if (status === "LOANED" && space.status === "IN_USE") return true;
        if (status === "IN_USE" && space.status === "LOANED") return true;
        return space.status === status;
    }) || [];

    if (searchSpace && /^\d+$/.test(searchSpace.trim())) {
        const artificialId = parseInt(searchSpace.trim());
        const cachedItem = itemCache.current[artificialId];
        if (cachedItem && !displaySpaces.some(s => s.id === cachedItem.id)) {
            displaySpaces = [cachedItem, ...displaySpaces];
        }
    }

    const {
        data: b_spaces,
        isPending: b_spacesIsPending,
        error: b_spacesIsError,
        refetch
    } = useQuery({
        queryKey: queryKey,
        queryFn: async () => {
            const params = {
                page: page,
                size: 20
            };
            if (searchSpace) params.searchQuery = searchSpace;
            if (showMode) params.showMode = showMode;
            if (status !== "") params.status = status;
            if (type !== "") params.spaceTypeId = type;

            return await apiFetch("/spaces", {
                method: "GET",
                params: params,
            });
        },
        retry: (failureCount, error) => error.status !== 404,
    });

    const toggleSpaceMutation = useMutation({
        mutationFn: async ({ id, currentlyActive }) => {
            const cleanId = String(id).trim();
            const action = currentlyActive ? "deactivate" : "activate";
            const endpoint = `/spaces/${cleanId}/${action}`;

            return apiFetch(endpoint, {
                method: "PATCH",
                headers: { 'X-API-Version': '1.0.0' }
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
                    <PlusButton text="Nuevo Espacio" onClick={() => setModalVisible(true)} />
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
                            <button className={styles.refreshIcon} title="Refrescar" onClick={() => refetch()}>
                                <FiRefreshCw />
                            </button>

                            <Filter
                                label="Disponibilidad:"
                                value={status}
                                onChange={(e) => {
                                    setStatus(e.target.value);
                                    setPage(0);
                                }}
                                options={statusOptions}
                            />

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
                                value={showMode}
                                onChange={(e) => {
                                    setShowMode(e.target.value);
                                    setPage(0);
                                }}
                                options={showModeOptions}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {b_spacesIsPending ? (
                <LoaderCircle />
            ) : b_spacesIsError ? (
                <Alert severity="error">Hubo un error al cargar los espacios</Alert>
            ) : (
                <>
                    <div className={tableStyles.wrapper}>
                        <div className={tableStyles.tableContainer}>
                            <table className={tableStyles.table}>
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: "center", width: "50px" }}>#</th>
                                        <th>Nombre</th>
                                        <th>Tipo</th>
                                        <th>Edificio</th>
                                        <th>Capacidad</th>
                                        <th>Estudiantes</th>
                                        <th>Disponibilidad</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displaySpaces.length > 0 ? (
                                        displaySpaces.map((space, index) => {
                                            // console.log para depurar los estados reales
                                            console.log(`Espacio: ${space.name} | Estado exacto backend: "${space.status}"`);

                                            return (
                                                <tr key={space.id}>
                                                    <td style={{ textAlign: 'center', color: '#6B7280', fontWeight: 'bold' }}>
                                                        {space._artificialId || (page * 20) + index + 1}
                                                    </td>
                                                    <td className={tableStyles.projectName}>{space.name}</td>
                                                    <td>{space.spaceType?.name || '—'}</td>
                                                    <td>{space.building?.name || '—'}</td>
                                                    <td>{space.capacity ?? '—'}</td>
                                                    <td>
                                                        <span className={`${tableStyles.badge} ${space.availableForStudents ? tableStyles.statusAbierto : tableStyles.statusRestringido}`}>
                                                            {space.availableForStudents ? "Abierto" : "Restringido"}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`${tableStyles.badge} ${space.status === "AVAILABLE" ? tableStyles.AVAILABLE :
                                                            (space.status === "LOANED" || space.status === "IN_USE") ? tableStyles.IN_USE :
                                                                tableStyles.badgeMantenimiento}`}>
                                                            {space.status === "AVAILABLE" ? "Disponible" : (space.status === "LOANED" || space.status === "IN_USE") ? "En uso" : "Mantenimiento"}
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
                                                    <td>
                                                        <div className={tableStyles.actions}>
                                                            <button className={tableStyles.iconButton} onClick={() => navigate(`/spaces/${space.id}`)}>
                                                                <FiEye size={18} />
                                                            </button>
                                                            <button className={tableStyles.iconButton} onClick={() => navigate(`/spaces/edit/${space.id}`)}>
                                                                <FiEdit2 size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="9" style={{ textAlign: "center", padding: "40px", color: "#64748B" }}>
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
                        totalPages={b_spaces?.totalPages || 0}
                        onPageChange={(newPage) => setPage(newPage)}
                    />
                </>
            )}
        </div>
    );
}

export default Spaces;