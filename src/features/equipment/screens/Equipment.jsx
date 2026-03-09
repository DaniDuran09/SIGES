import { FiPlus, FiSearch } from "react-icons/fi";
import styles from "../styles/Equipment.module.css";
import tableStyles from "../styles/EquipmentData.module.css";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../../api/client";
import { useState } from "react";
import LoaderCircle from "../../../assets/components/LoaderCircle";

function Equipments() {

    const [searchEquipment, setSearchEquipment] = useState('');
    const [state, setState] = useState('');
    // const [type, setType] = useState('');

    const { data: b_equipments, isPending: b_equipmentsIsPending, error: b_equipmentsIsError } = useQuery({
        queryKey: ["GetEquipments", searchEquipment, state],
        queryFn: () => apiFetch("/equipments", {
            method: "GET",
            params: {
                searchQuery: searchEquipment,
                status: state,
                // type: type 
            }
        }),
    });

    if (b_equipmentsIsError) {
        return <div className={styles.container}>Error: {b_equipmentsIsError.message}</div>;
    }

    return (
        <div className={styles.container}>

            <div className={styles.header}>

                <h4>Gestión</h4>

                <div className={styles.headerRow}>
                    <h1>Equipos</h1>

                    <button className={styles.newRequestButton}>
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
                            {/* 
                            <select 
                                className={styles.state}
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                <option value="">Tipo: Todos</option>
                                <option value="Proyector">Proyector</option>
                            </select>
                            */}

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

            {b_equipmentsIsPending ? (
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
                                    {/* <th>Tipo</th> */}
                                    <th>No. Inventario</th>
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
                                        {/* <td>{equipment.type}</td> */}
                                        <td>{equipment.inventoryIdNum || '—'}</td>
                                        <td>{equipment.spaceAttached?.name || equipment.building?.name || '—'}</td>

                                        <td>
                                            <span className={`${tableStyles.badge} ${tableStyles[equipment.availableForStudents ? "Abierto" : "Restringido"]}`}>
                                                {equipment.availableForStudents ? "Abierto" : "Restringido"}
                                            </span>
                                        </td>

                                        <td>
                                            <span className={`${tableStyles.badge} ${tableStyles[equipment.status]}`}>
                                                {equipment.status}
                                            </span>
                                        </td>

                                        <td>
                                            <button className={tableStyles.detailsButton}>
                                                Detalles
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