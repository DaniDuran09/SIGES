import { FiPlus, FiSearch } from "react-icons/fi";
import styles from "../styles/Equipment.module.css";
import tableStyles from "../styles/EquipmentData.module.css";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../../api/client";
import { useState } from "react";
import LoaderCircle from "../../../assets/components/LoaderCircle";
import NewEquipmentModal from "../components/NewEquipmentModal";

function Equipments() {
    const [searchEquipment, setSearchEquipment] = useState('');
    const [state, setState] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const {
        data: b_equipments,
        isPending,
        error
    } = useQuery({
        queryKey: ["GetEquipments", searchEquipment, state],
        queryFn: () =>
            apiFetch("/equipments", {
                method: "GET",
                params: {
                    searchQuery: searchEquipment,
                    status: state,
                },
            }),
    });

    if (error) {
        return (
            <div className={styles.container}>
                Error: {error.message}
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

                    <button className={styles.newRequestButton} onClick={() => setModalVisible(true)}>
                        <FiPlus style={{ width: '25px', height: '25px', color: 'white' }} />
                        <h3 className={styles.newRequestText}>
                            Nuevo Equipo
                        </h3>
                    </button>
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
                                <option value="ACTIVE">Activo</option>
                                <option value="MAINTENANCE">Mantenimiento</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {isPending ? (
                <LoaderCircle />
            ) : (
                <div className={tableStyles.wrapper}>
                    {!b_equipments?.content || b_equipments.content.length === 0 ? (
                        <div className={tableStyles.empty}>
                            <p>No hay equipos registrados</p>
                        </div>
                    ) : (
                        <table className={tableStyles.table}>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Tipo</th>
                                    <th>No°Inventario</th>
                                    <th>Espacio Asociado</th>
                                    <th>Estudiantes</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {b_equipments.content.map((equipment) => (
                                    <tr key={equipment.id}>
                                        <td>{equipment.name}</td>
                                        <td>{equipment.spaceAttached?.spaceType?.name || '—'}</td>
                                        <td>{equipment.inventoryIdNum || '—'}</td>
                                        <td>{equipment.spaceAttached?.name || '—'}</td>

                                        <td>
                                            <span
                                                className={`${tableStyles.badge} ${
                                                    equipment.availableForStudents
                                                        ? tableStyles.true
                                                        : tableStyles.false
                                                }`}
                                            >
                                                {equipment.availableForStudents ? "Yes" : "No"}
                                            </span>
                                        </td>

                                        <td>
                                            <span
                                                className={`${tableStyles.badge} ${
                                                    tableStyles[equipment.status] || ''
                                                }`}
                                            >
                                                {equipment.status}
                                            </span>
                                        </td>

                                        <td>
                                            <button className={tableStyles.detailsButton}>
                                                {equipment.id}
                                            </button>
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

export default Equipments;