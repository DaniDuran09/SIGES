import { FiPlus, FiSearch, FiEye, FiEdit2, FiRefreshCw } from "react-icons/fi";
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

    const opcionesEstado = [
        { value: "All", text: "Todos" },
        { value: "ACTIVE", text: "Activo" },
        { value: "INACTIVE", text: "Inactivo" }
    ];

    const opcionesTipo = [
        { value: "ACTIVE", text: "Aula" }
    ];

    const { data: b_types } = useQuery({
        queryKey: ["GetTypeSpaces"],
        queryFn: () =>
            apiFetch("/space-types", {
                method: "GET",
            }),
    });

    const {
        data: b_spaces,
        isPending: b_spacesIsPending,
        error: b_spacesIsError,
    } = useQuery({
        queryKey: ["GetSpaces", searchSpace, state, type, page],
        queryFn: () =>
            apiFetch("/spaces", {
                method: "GET",
                params: {
                    searchQuery: searchSpace,
                    showMode: state,
                    buildingId: type,
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
                        onChange={(e) => setSearchSpace(e.target.value)}
                    />

                    <div className={styles.componentSearch}>
                        <div className={styles.optionAndState}>

                            <button className={styles.refreshIcon} title="Refrescar">
                                <FiRefreshCw />
                            </button>

                            <Filter
                                label="Tipo"
                                value=""
                                onChange={(e) => setState(e.target.value)}
                                options={opcionesTipo}
                            />

                            <Filter
                                label="Estado"
                                value=""
                                onChange={(e) => setState(e.target.value)}
                                options={opcionesEstado}
                            />

                        </div>
                    </div>
                </div>
            </div>

            {b_spacesIsPending ? (
                <LoaderCircle />
            ) : (
                <div className={tableStyles.wrapper}>
                    {b_spaces?.content?.length === 0 ? (
                        <div className={tableStyles.empty}>
                            <p>No se encontraron registros</p>
                        </div>
                    ) : (
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
                            {b_spaces.content.map((space) => (
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
                                        <span className={`${tableStyles.badge} ${tableStyles[space.status] || ''}`}>
                                            {space.status === "AVAILABLE" ? "Disponible" : space.status === "IN_USE" ? "En uso" : "Mantenimiento"}
                                        </span>
                                    </td>

                                    <td>
                                        <label className={tableStyles.switch}>
                                            <input
                                                type="checkbox"
                                                checked={space.active ?? true}
                                                readOnly
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
                                            <FiEye />
                                        </button>

                                        <button 
                                            className={tableStyles.iconButton}
                                            onClick={() => navigate(`/spaces/edit/${space.id}`)}
                                            title="Editar espacio"
                                        >
                                            <FiEdit2 />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
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