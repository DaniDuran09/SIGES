import { FiPlus, FiSearch } from "react-icons/fi";
import styles from "../styles/Equipment.module.css";
import tableStyles from "../styles/EquipmentData.module.css";
import {useQuery} from "@tanstack/react-query";
import {apiFetch} from "../../../api/client.js";
import LoaderCircle from "../../../assets/components/LoaderCircle.jsx";
import {Alert} from "@mui/material";

function Equipments() {
    const { data: b_equipments, isLoading: b_equipmentsIsLoading, isError: b_equipmentsIsError } = useQuery({
        queryKey: ["GetEquipments"],
        queryFn: () => apiFetch("/equipments", {
            method: "GET",
        }),
    });

    if (b_equipmentsIsLoading) {
        return <LoaderCircle />;
    }

    if (b_equipmentsIsError){
        return <Alert severity="error"> Hubo un error al cargar los equipos </Alert>;
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
                        />
                    </div>

                    <div className={styles.componentSearch}>
                        <div className={styles.optionAndState}>
                            <select className={styles.state}>
                                <option value="">Tipo: Todos</option>
                                <option value="Proyector">Proyector</option>
                            </select>

                            <select className={styles.sort}>
                                <option value="">Estado: Todos</option>
                                <option value="disponible">Disponible</option>
                            </select>
                        </div>
                    </div>

                </div>

            </div>

            <div className={tableStyles.wrapper}>
                <table className={tableStyles.table}>

                    <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Tipo</th>
                        <th>No°Inventario</th>
                        <th>Espacio Asociado</th>
                        <th>Estdiantes</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>

                    <tbody>
                    {b_equipments?.content?.length !== 0 ? (
                        b_equipments.content.map((equipment, index) => (
                            <tr key={index}>
                                <td>{equipment.name}</td>
                                <td>{equipment.spaceAttached?.spaceType?.name}</td>
                                <td>{equipment.inventoryIdNum}</td>
                                <td>{equipment.spaceAttached?.name}</td>

                                <td>
                                        <span className={`${tableStyles.badge} ${tableStyles[equipment.availableForStudents]}`}>
                                            {equipment.availableForStudents ? "Yes" : "No"}
                                        </span>
                                </td>

                                <td>
                                        <span className={`${tableStyles.badge} ${tableStyles[equipment.status]}`}>
                                            {equipment.status}
                                        </span>
                                </td>

                                <td>
                                    <button className={tableStyles.detailsButton}>
                                        {equipment.id}
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                                No hay equipos registrados
                            </td>
                        </tr>
                    )}
                    </tbody>

                </table>
            </div>

        </div>
    );
}

export default Equipments;