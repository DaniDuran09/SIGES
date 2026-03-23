import { FiPlus, FiSearch, FiEye, FiEdit2 } from "react-icons/fi";
import styles from "../styles/Equipment.module.css";
import tableStyles from "../styles/EquipmentData.module.css";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../../api/client";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LoaderCircle from "../../../assets/components/LoaderCircle";
import NewEquipmentModal from "../components/NewEquipmentModal";
import { Alert } from "@mui/material";
import Pagination from "../../../assets/components/Pagination";
import PlusButton from "../../../assets/components/PlusButton.jsx";

function Equipments() {
    const [searchEquipment, setSearchEquipment] = useState('');
    const [state, setState] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const navigate = useNavigate();
    const [page, setPage] = useState(0);

    const {
        data: b_equipments,
        isPending,
        error
    } = useQuery({
        queryKey: ["GetEquipments", searchEquipment, state, page],
        queryFn: () =>
            apiFetch("/equipments", {
                method: "GET",
                params: {
                    searchQuery: searchEquipment,
                    status: state,
                    page: page,
                    size: 20
                },
            }),
        retry: (failureCount, error) => error.status !== 404,
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case "AVAILABLE":
                return <span className={`${tableStyles.badge} ${tableStyles.badgeDisponible}`}>Disponible</span>;
            case "IN_USE":
                return <span className={`${tableStyles.badge} ${tableStyles.badgeEnUso}`}>En uso</span>;
            case "MAINTENANCE":
                return <span className={`${tableStyles.badge} ${tableStyles.badgeMantenimiento}`}>Mantenimiento</span>;
            case "DAMAGED":
                return <span className={`${tableStyles.badge} ${tableStyles.badgeEnUso}`}>Dañado</span>;
            default:
                return <span className={tableStyles.badge}>{status}</span>;
        }
    };

    if (error && error.status !== 404) {
        return (
            <div className={styles.container}>
                <Alert severity="error">Error al cargar los equipos: {error.message}</Alert>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {modalVisible && <NewEquipmentModal onClose={() => setModalVisible(false)} />}
            <div className={styles.header}>
                <h4>Gestión</h4>

                <div className={styles.headerRow}>
                    <h1>Equipos</h1>

                    <PlusButton
                        text="Nuevo Equipo"
                        onClick={() => setModalVisible(true)}
                    />
                </div>

                <div className={styles.searchBar}>
                    <div className={styles.searchContainer}>
                        <FiSearch className={styles.searchIcon} />
                        <input
                            className={styles.search}
                            type="search"
                            placeholder="Buscar equipo..."
                            value={searchEquipment}
                            onChange={(e) => setSearchEquipment(e.target.value)}
                        />
                    </div>

                    <div className={styles.componentSearch}>
                        <div className={styles.optionAndState}>
                            <select
                                className={styles.sort}
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                            >
                                <option value="">Estado: Todos</option>
                                <option value="AVAILABLE">Disponible</option>
                                <option value="MAINTENANCE">Mantenimiento</option>
                                <option value="DAMAGED">Dañado</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {isPending ? (
                <LoaderCircle />
            ) : (
                <div className={tableStyles.wrapper}>
                    <div className={tableStyles.tableContainer}>
                        <table className={tableStyles.table}>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Tipo</th>
                                    <th>Nº Inventario</th>
                                    <th>Edificio</th>
                                    <th>Estudiantes</th>
                                    <th>Disponibilidad</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {b_equipments?.content?.length !== 0 ? (
                                    b_equipments?.content?.map((equipment) => (
                                        <tr key={equipment.id}>
                                            <td className={tableStyles.equipmentName}>{equipment.name}</td>
                                            <td>{equipment.type?.name || "N/A"}</td>
                                            <td>{equipment.inventoryIdNum}</td>
                                            <td>{equipment.building?.name || "N/A"}</td>

                                            <td>
                                                <span className={`${tableStyles.badge} ${equipment.availableForStudents ? tableStyles.statusAbierto : tableStyles.statusRestringido}`}>
                                                    {equipment.availableForStudents ? "Abierto" : "Restringido"}
                                                </span>
                                            </td>

                                            <td>
                                                {getStatusBadge(equipment.status)}
                                            </td>
                                            <td>
                                                <label className={tableStyles.switch}>
                                                    <input
                                                        type="checkbox"
                                                        checked={equipment.availableForStudents}
                                                        readOnly
                                                    />
                                                    <span className={tableStyles.slider}></span>
                                                </label>
                                            </td>


                                            <td>
                                                <div className={tableStyles.actions}>
                                                    <button
                                                        className={tableStyles.iconButton}
                                                        title="Ver detalles"
                                                        onClick={() => navigate(`/equipment/${equipment.id}`)}
                                                    >
                                                        <FiEye size={18} />
                                                    </button>
                                                    <button
                                                        className={tableStyles.iconButton}
                                                        title="Editar equipo"
                                                        onClick={() => navigate(`/equipment/edit/${equipment.id}`)}
                                                    >
                                                        <FiEdit2 size={18} />
                                                    </button>
                                                </div>
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
                    <Pagination
                        currentPage={page}
                        totalPages={b_equipments?.totalPages || 0}
                        onPageChange={(newPage) => setPage(newPage)}
                    />
                </div>
            )}
        </div>
    );
}

export default Equipments;
