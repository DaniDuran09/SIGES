import { IoMdNotificationsOutline } from "react-icons/io";
import { FiSearch, FiEye } from "react-icons/fi";
import styles from "../styles/Requests.module.css";
import tableStyles from "../styles/RequestsData.module.css";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../../api/client";
import LoaderCircle from "../../../assets/components/LoaderCircle";
import { Alert } from "@mui/material";
import Pagination from "../../../assets/components/Pagination";
import SearchBar from "../../../assets/components/SearchBar.jsx";
import Filter from "../../../assets/components/Filter.jsx";

function Requests() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [status, setStatus] = useState("ALL");

    const opcionesEstado = [
        { value: "AVAILABLE", text: "Disponible" },
        { value: "MAINTENANCE", text: "Mantenimiento" },
        { value: "DAMAGED", text: "Dañado" }
    ];

    const {
        data: b_requests,
        isPending,
        error
    } = useQuery({
        queryKey: ["GetRequests", search, status, page],
        queryFn: () =>
            apiFetch("/requests", {
                method: "GET",
                params: {
                    searchQuery: search,
                    status: status === "ALL" ? "" : status,
                    page: page,
                    size: 20
                },
            }),
        retry: (failureCount, error) => error.status !== 404,
    });

    if (error && error.status !== 404) {
        return (
            <div className={styles.container}>
                <Alert severity="error">Error al cargar las solicitudes: {error.message}</Alert>
            </div>
        );
    }
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h4>Gestión</h4>

                <div className={styles.topBar}>
                    <h1>Solicitudes</h1>
                    <button className={styles.notificationButton}>
                        {true && (
                            <div style={{ width: '15px', height: '15px', backgroundColor: '#FF9B85', borderRadius: '50%', position: 'absolute', top: '5px', right: '5px' }} />
                        )}
                        <IoMdNotificationsOutline style={{ width: '30px', height: '30px' }} />
                    </button>
                </div>

                <div className={styles.tabs}>
                    <button className={status === "ALL" ? styles.active : ""} onClick={() => {setStatus("ALL"); setPage(0);}}>Todas</button>
                    <button className={status === "PENDING" ? styles.active : ""} onClick={() => {setStatus("PENDING"); setPage(0);}}>Pendientes</button>
                    <button className={status === "APPROVED" ? styles.active : ""} onClick={() => {setStatus("APPROVED"); setPage(0);}}>Aprobadas</button>
                    <button className={status === "DENIED" ? styles.active : ""} onClick={() => {setStatus("DENIED"); setPage(0);}}>Denegadas</button>
                </div>

                <div className={styles.searchBar}>

                    <SearchBar
                        type="search"
                        placeholder="Buscar Solicitudes..."
                        value={search}
                        onChange={(e) =>{setSearch(e.target.value); setPage(0);}}
                    />

                    <Filter
                        label="Tipo"
                        value=""
                        options={opcionesEstado}
                    />

                </div>
            </div>

            {isPending ? (
                <LoaderCircle />
            ) : (
                <>
                    <div className={tableStyles.wrapper}>
                        <table className={tableStyles.table}>
                            <thead>
                            <tr>
                                <th>Usuario</th>
                                <th>Recurso</th>
                                <th>Fecha</th>
                                <th>Horario</th>
                                <th>Tipo</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                            </thead>
                            <tbody>
                            {b_requests?.content?.length > 0 ? (
                                b_requests.content.map((item) => (
                                    <tr key={item.id}>
                                        <td className={tableStyles.usuario}>{item.user?.firstName} {item.user?.lastName}</td>
                                        <td>{item.reservable?.name}</td>
                                        <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                                        <td>{item.startTime} - {item.endTime}</td>
                                        <td>{item.reservableType === 'EQUIPMENT' ? 'Equipo' : 'Espacio'}</td>
                                            <td>
                                                    <span className={`${tableStyles.badge} ${
                                                        item.status === 'PENDING' ? tableStyles.pendiente :
                                                        item.status === 'APPROVED' ? tableStyles.aprobada :
                                                        item.status === 'DENIED' ? tableStyles.denegada :
                                                        item.status === 'COMPLETED' ? tableStyles.completada :
                                                        ''
                                                    }`}>
                                                        {item.status === 'PENDING' ? 'Pendiente' :
                                                         item.status === 'APPROVED' ? 'Aprobada' :
                                                         item.status === 'DENIED' ? 'Denegada' :
                                                         item.status === 'COMPLETED' ? 'Completada' : item.status}
                                                    </span>
                                            </td>
                                        <td className={tableStyles.actions}>
                                            <button className={tableStyles.viewButton}>
                                                <FiEye />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                                        No se encontraron registros
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                    <Pagination 
                        currentPage={page} 
                        totalPages={b_requests?.totalPages || 0} 
                        onPageChange={(newPage) => setPage(newPage)} 
                    />
                </>
            )}
        </div>
    );
}

export default Requests;