import { FiPlus, FiSearch } from "react-icons/fi";
import styles from "../styles/Spaces.module.css";
import tableStyles from "../styles/SpacesData.module.css";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../../api/client";
import { NewSpaceModal } from "../components/NewSpaceModal";
import { useState } from "react";
import LoaderCircle from "../../../assets/components/LoaderCircle";

function Spaces() {

    const [modalVisible, setModalVisible] = useState(false);

    const { data: spaces, isPending, error } = useQuery({
        queryKey: ["GetSpaces"],
        queryFn: () => apiFetch("/spaces", {
            method: "GET",
        }),
    });

    if (isPending) {
        return (
            <LoaderCircle />
        );
    }

    if (error) {
        return <div className={styles.container}>Error: {error.message}</div>;
    }

    return (
        <div className={styles.container}>
            {modalVisible && <NewSpaceModal onClose={() => setModalVisible(false)} />}
            <div className={styles.header}>

                <h4>Gestión</h4>

                <div className={styles.headerRow}>
                    <h1>Espacios</h1>

                    <button onClick={() => setModalVisible(true)} className={styles.newRequestButton}>
                        <FiPlus style={{ width: '25px', height: '25px', color: 'white' }} />
                        <h3 className={styles.newRequestText}>
                            Nuevo espacio
                        </h3>
                    </button>
                </div>

                <div className={styles.searchBar}>

                    <div className={styles.searchContainer}>
                        <FiSearch className={styles.searchIcon} />
                        <input
                            className={styles.search}
                            type="search"
                            placeholder="Buscar espacio..."
                        />
                    </div>

                    <div className={styles.componentSearch}>
                        <div className={styles.optionAndState}>
                            <select className={styles.state}>
                                <option value="">Tipo: Todos</option>
                                <option value="Auditorio">Auditorio</option>
                                <option value="Sala">Sala</option>
                                <option value="Laboratorio">Laboratorio</option>
                            </select>

                            <select className={styles.sort}>
                                <option value="">Estado: Todos</option>
                                <option value="disponible">Disponible</option>
                                <option value="enUso">En uso</option>
                                <option value="mantenimiento">Mantenimiento</option>
                            </select>
                        </div>
                    </div>

                </div>

            </div>

            <div className={tableStyles.wrapper}>
                {spaces?.content?.length === 0 ? (
                    <div className={tableStyles.empty}>
                        <p>No hay espacios registrados</p>
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
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {spaces?.content?.map((space) => (
                                <tr key={space.id}>
                                    <td>{space.name}</td>

                                    <td>{space.spaceType?.name}</td>

                                    <td>{space.building?.name}</td>

                                    <td>{space.capacity}</td>

                                    <td>
                                        <span
                                            className={`${tableStyles.badge} ${tableStyles[
                                                space.availableForStudents ? "Abierto" : "Restringido"
                                            ]
                                                }`}
                                        >
                                            {space.availableForStudents ? "Abierto" : "Restringido"}
                                        </span>
                                    </td>

                                    <td>
                                        <span
                                            className={`${tableStyles.badge} ${tableStyles[space.status]
                                                }`}
                                        >
                                            {space.status}
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

        </div>
    );
}

export default Spaces;