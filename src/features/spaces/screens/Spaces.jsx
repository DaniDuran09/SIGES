import { FiPlus, FiSearch } from "react-icons/fi";
import styles from "../styles/Spaces.module.css";
import tableStyles from "../styles/SpacesData.module.css";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../../api/client";
import { NewSpaceModal } from "../components/NewSpaceModal";
import { useEffect, useState } from "react";
import LoaderCircle from "../../../assets/components/LoaderCircle";

function Spaces() {

    const [modalVisible, setModalVisible] = useState(false);
    const [searchSpace, setSearchSpace] = useState('');
    const [state, setState] = useState('ALL');
    const [type, setType] = useState('');

    const { data: b_types, isPending: b_typesIsPending, error: b_typesIsError } = useQuery({
        queryKey: ["GetTypeSpaces"],
        queryFn: () => apiFetch("/spacetypes", {
            method: 'GET',
        })
    })

    const { data: b_spaces, isPending: b_spacesIsPending, error: b_spacesIsError } = useQuery({
        queryKey: ["GetSpaces", searchSpace, state, type],
        queryFn: () => apiFetch("/spaces", {
            method: "GET",
            params: {
                searchQuery: searchSpace,
                showMode: state,
                buildingId: type

            }
        }),
    });

    if (b_spacesIsError) {
        return <div className={styles.container}>Error: {b_spacesIsError.message}</div>;
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
                            onChange={(e) => setSearchSpace(e.target.value)}
                        />
                    </div>

                    <div className={styles.componentSearch}>
                        <div className={styles.optionAndState}>
                            <select
                                className={styles.state}
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                <option value="">Tipo: Todos</option>

                                {b_types?.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                className={styles.sort}
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                            >
                                <option value="ALL">Estado: Todos</option>
                                <option value="ACTIVE">Activo</option>
                                <option value="INACTIVE">Inactivo</option>
                            </select>
                        </div>
                    </div>

                </div>

            </div>

            {b_spacesIsPending ? (
                <LoaderCircle />) :
                (
                    <div className={tableStyles.wrapper}>
                        {b_spaces?.content?.length === 0 ? (
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
                                    {b_spaces?.content?.map((space) => (
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
                )
            }


        </div>
    );
}

export default Spaces;