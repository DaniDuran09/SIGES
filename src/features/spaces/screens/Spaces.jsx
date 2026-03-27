import { FiEye, FiEdit2, FiRefreshCw } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Spaces.module.css";
import tableStyles from "../styles/SpacesData.module.css";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../../api/client";
import { NewSpaceModal } from "../components/NewSpaceModal";
import { useState } from "react";
import LoaderCircle from "../../../assets/components/LoaderCircle";
import { Alert } from "@mui/material";
import Pagination from "../../../assets/components/Pagination";
import PlusButton from "../../../assets/components/PlusButton.jsx";
import SearchBar from "../../../assets/components/SearchBar.jsx";
import Filter from "../../../assets/components/Filter.jsx";

function Spaces() {
    const navigate = useNavigate();
    const [modalVisible, setModalVisible] = useState(false);
    const [searchSpace, setSearchSpace] = useState('');
    const [state, setState] = useState('ALL');
    const [type, setType] = useState('');
    const [page, setPage] = useState(0);

    const statusOptions = [
        { value: "ALL", text: "Todos" },
        { value: "ACTIVE", text: "Activo" },
        { value: "INACTIVE", text: "Inactivo" },
    ];

    const { data: b_types } = useQuery({
        queryKey: ["GetTypeSpaces"],
        queryFn: () => apiFetch("/space-types", { method: "GET" }),
    });

    const typeOptions = [
        { value: "", text: "Todos" },
        ...(b_types?.map((t) => ({
            value: t.id.toString(),
            text: t.name,
        })) || []),
    ];

    const {
        data: b_spaces,
        isPending: b_spacesIsPending,
        error: b_spacesIsError,
        refetch
    } = useQuery({
        queryKey: ["GetSpaces", searchSpace, state, type, page],
        queryFn: () =>
            apiFetch("/spaces", {
                method: "GET",
                params: {
                    searchQuery: searchSpace,
                    showMode: state,
                    spaceTypeId: type,
                    page: page,
                    size: 20
                },
            }),
        retry: (failureCount, error) => error.status !== 404,
    });

    if (b_spacesIsError && b_spacesIsError.status !== 404) {
        return (
            <div className={styles.container}>
                <Alert severity="error">Error al cargar los espacios: {b_spacesIsError.message}</Alert>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {modalVisible && <NewSpaceModal onClose={() => setModalVisible(false)} />}

            <div className={styles.header}>
                <h4>Gestión</h4>
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

                    <button className={styles.refreshIcon} title="Refrescar" onClick={() => refetch()}>
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

            {b_spacesIsPending ? (
                <LoaderCircle />
            ) : (
                <div className={tableStyles.wrapper}>
                    <div className={tableStyles.tableContainer}>
                        <table className={tableStyles.table}>
                            <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Tipo</th>
                                <th>Ubicación</th>
                                <th>Capacidad</th>
                                <th>Estudiantes</th>
                                <th>Disponibilidad</th>
                                <th>Estado</th>
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
                                                <span className={space.availableForStudents ? tableStyles.statusAbierto : tableStyles.statusRestringido}>
                                                    {space.availableForStudents ? "Abierto" : "Restringido"}
                                                </span>
                                        </td>
                                        <td>
                                                <span className={`${tableStyles.badge} ${
                                                    space.status === "AVAILABLE" ? tableStyles.badgeDisponible :
                                                        space.status === "IN_USE" ? tableStyles.badgeEnUso :
                                                            tableStyles.badgeMantenimiento
                                                }`}>
                                                    {space.status === "AVAILABLE" ? "Disponible" : space.status === "IN_USE" ? "En uso" : "Mantenimiento"}
                                                </span>
                                        </td>
                                        <td>
                                            <label className={tableStyles.switch}>
                                                <input type="checkbox" checked={space.active ?? true} readOnly />
                                                <span className={tableStyles.slider}></span>
                                            </label>
                                        </td>
                                        <td>
                                            <div className={tableStyles.actions}>
                                                <button className={tableStyles.iconButton} onClick={() => navigate(`/spaces/${space.id}`)} title="Ver detalle">
                                                    <FiEye size={18} />
                                                </button>
                                                <button className={tableStyles.iconButton} onClick={() => navigate(`/spaces/edit/${space.id}`)} title="Editar espacio">
                                                    <FiEdit2 size={18} />
                                                </button>
                                            </div>
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
                    </div>
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