import { FiEye, FiEdit2, FiRefreshCw } from "react-icons/fi";
import styles from "../styles/Equipment.module.css";
import tableStyles from "../styles/EquipmentData.module.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../../api/client";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LoaderCircle from "../../../assets/components/LoaderCircle";
import NewEquipmentModal from "../components/NewEquipmentModal";
import { Alert } from "@mui/material";
import Pagination from "../../../assets/components/Pagination";
import PlusButton from "../../../assets/components/PlusButton.jsx";
import SearchBar from "../../../assets/components/SearchBar.jsx";
import Filter from "../../../assets/components/Filter.jsx";

function Equipments() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [searchEquipment, setSearchEquipment] = useState('');
    const [status, setStatus] = useState('');
    const [type, setType] = useState('');
    const [page, setPage] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);

    const statusOptions = [
        { value: "", text: "Disponibilidad: Todos" },
        { value: "AVAILABLE", text: "Disponible" },
        { value: "MAINTENANCE", text: "Mantenimiento" },
        { value: "LOANED", text: "En préstamo" },
    ];

    const { data: e_types } = useQuery({
        queryKey: ["GetEquipmentTypes"],
        queryFn: () => apiFetch("/equipment-types", { method: "GET" }),
    });

    const typeOptions = [
        { value: "", text: "Tipo: Todos" },
        ...(e_types?.map((t) => ({
            value: t.id.toString(),
            text: t.name,
        })) || []),
    ];

    const queryKey = ["GetEquipments", searchEquipment, status, type, page];

    const {
        data: b_equipments,
        isPending,
        error,
        refetch
    } = useQuery({
        queryKey: queryKey,
        queryFn: async () => {
            const cleanSearch = searchEquipment.trim();
            const params = {
                searchQuery: cleanSearch !== "" ? cleanSearch : undefined,
                page: page,
                size: 20,
                showMode: "ALL"
            };
            if (status !== "") params.status = status;
            if (type !== "") params.equipmentTypeId = type;

            return await apiFetch("/equipments", {
                method: "GET",
                params: params,
            });
        },
        retry: (failureCount, error) => error.status !== 404,
    });

    const toggleEquipmentMutation = useMutation({
        mutationFn: async ({ id, currentlyActive }) => {
            const action = currentlyActive ? "deactivate" : "activate";
            return apiFetch(`/equipments/${id}/${action}`, { method: "PATCH" });
        },
        onMutate: async ({ id }) => {
            await queryClient.cancelQueries({ queryKey });
            const previousData = queryClient.getQueryData(queryKey);

            queryClient.setQueryData(queryKey, (old) => {
                if (!old) return old;
                return {
                    ...old,
                    content: old.content.map((item) =>
                        item.id === id
                            ? { ...item, deletedAt: item.deletedAt ? null : new Date().toISOString() }
                            : item
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

    const handleToggleActive = (equipment) => {
        const isActive = equipment.deletedAt === null;
        toggleEquipmentMutation.mutate({
            id: equipment.id,
            currentlyActive: isActive
        });
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
                    <SearchBar
                        type="search"
                        placeholder="Buscar Equipos..."
                        value={searchEquipment}
                        onChange={(e) => {
                            setSearchEquipment(e.target.value);
                            setPage(0);
                        }}
                    />

                    <div className={styles.filterGroup}>
                        <button
                            className={styles.refreshIcon}
                            onClick={() => refetch()}
                        >
                            <FiRefreshCw />
                        </button>

                        <Filter
                            value={type}
                            onChange={(e) => {
                                setType(e.target.value);
                                setPage(0);
                            }}
                            options={typeOptions}
                        />

                        <Filter
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value);
                                setPage(0);
                            }}
                            options={statusOptions}
                        />
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
                            {b_equipments?.content?.length > 0 ? (
                                b_equipments.content.map((equipment) => (
                                    <tr key={equipment.id}>
                                        <td className={tableStyles.projectName}>{equipment.name}</td>
                                        <td>{equipment.type?.name || "—"}</td>
                                        <td>{equipment.inventoryIdNum || "—"}</td>
                                        <td>{equipment.building?.name || "—"}</td>
                                        <td>
                                            <span className={`${tableStyles.badge} ${equipment.availableForStudents ? tableStyles.statusAbierto : tableStyles.statusRestringido}`}>
                                                {equipment.availableForStudents ? "Abierto" : "Restringido"}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`${tableStyles.badge} ${
                                                equipment.status === "AVAILABLE" ? tableStyles.badgeDisponible :
                                                    equipment.status === "LOANED" ? tableStyles.badgeEnUso :
                                                        tableStyles.badgeMantenimiento
                                            }`}>
                                                {equipment.status === "AVAILABLE" ? "Disponible" :
                                                    equipment.status === "LOANED" ? "En préstamo" : "Mantenimiento"}
                                            </span>
                                        </td>
                                        <td>
                                            <label className={tableStyles.switch} onClick={(e) => e.stopPropagation()}>
                                                <input
                                                    type="checkbox"
                                                    checked={equipment.deletedAt === null}
                                                    onChange={() => handleToggleActive(equipment)}
                                                    disabled={toggleEquipmentMutation.isPending}
                                                />
                                                <span className={tableStyles.slider}></span>
                                            </label>
                                        </td>
                                        <td>
                                            <div className={tableStyles.actions}>
                                                <button
                                                    className={tableStyles.iconButton}
                                                    onClick={() => navigate(`/equipment/${equipment.id}`)}
                                                >
                                                    <FiEye size={18} />
                                                </button>
                                                <button
                                                    className={tableStyles.iconButton}
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
                        totalPages={b_equipments?.totalPages || 0}
                        onPageChange={(newPage) => setPage(newPage)}
                    />
                </div>
            )}
        </div>
    );
}

export default Equipments;