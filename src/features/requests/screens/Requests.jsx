import { IoMdNotificationsOutline } from "react-icons/io";
import { FiEye, FiRefreshCw } from "react-icons/fi";
import styles from "../styles/Requests.module.css";
import tableStyles from "../styles/RequestsData.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../../api/client";
import LoaderCircle from "../../../assets/components/LoaderCircle";
import { Alert } from "@mui/material";
import Pagination from "../../../assets/components/Pagination";
import SearchBar from "../../../assets/components/SearchBar.jsx";
import Filter from "../../../assets/components/Filter.jsx";

function Requests() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [status, setStatus] = useState("ALL");

    const opcionesTipo = [
        { value: "ALL", text: "Tipo: Todos" },
        { value: "EQUIPMENT", text: "Equipo" },
        { value: "SPACE", text: "Espacio" }
    ];

    const {
        data: b_requests,
        isPending,
        error,
        refetch
    } = useQuery({
        queryKey: ["GetRequests", search, status, page],
        queryFn: () =>
            apiFetch("/reservations", {
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

    const getStatusInfo = (status) => {
        switch (status) {
            case 'PENDING':
                return { className: tableStyles.pendiente, text: 'Pendiente' };
            case 'APPROVED':
                return { className: tableStyles.aprobada, text: 'Aprobada' };
            case 'DENIED':
            case 'REJECTED':
                return { className: tableStyles.denegada, text: 'Denegada' };
            case 'COMPLETED':
            case 'FINISHED':
                return { className: tableStyles.completada, text: 'Completada' };
            case 'CANCELLED':
                return { className: tableStyles.completada, text: 'Cancelada' };
            default:
                return { className: tableStyles.completada, text: status };
        }
    };

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

                </div>

                <div className={styles.tabsContainer}>
                    <div className={styles.tabs}>
                        <button className={status === "ALL" ? styles.active : ""} onClick={() => { setStatus("ALL"); setPage(0); }}>Todas</button>
                        <button className={status === "PENDING" ? styles.active : ""} onClick={() => { setStatus("PENDING"); setPage(0); }}>Pendientes</button>
                        <button className={status === "APPROVED" ? styles.active : ""} onClick={() => { setStatus("APPROVED"); setPage(0); }}>Aprobadas</button>
                        <button className={status === "DENIED" ? styles.active : ""} onClick={() => { setStatus("DENIED"); setPage(0); }}>Denegadas</button>
                    </div>
                </div>

                <div className={tableStyles.searchBar}>
                    <SearchBar
                        type="search"
                        placeholder="Buscar Solicitudes..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                    />

                    <button
                        className={styles.refreshIcon}
                        title="Refrescar"
                        onClick={() => refetch()}
                    >
                        <FiRefreshCw />
                    </button>

                    <div className={tableStyles.filterComponent}>
                        <Filter
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value);
                                setPage(0);
                            }}
                            options={opcionesTipo}
                        />
                    </div>
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
                                    <th>Usuarios</th>
                                    <th>Recurso</th>
                                    <th>Fecha</th>
                                    <th>Horario</th>
                                    <th>Tipo</th>
                                    <th>Estado</th>
                                    <th style={{ textAlign: "center" }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {b_requests?.content?.length > 0 ? (
                                    b_requests.content.map((item) => {
                                        const statusInfo = getStatusInfo(item.status);
                                        return (
                                            <tr key={item.id}>
                                                <td className={tableStyles.usuario}>
                                                    {(item.petitioner?.firstName || item.user?.firstName)} {(item.petitioner?.lastName || item.user?.lastName)}
                                                </td>
                                                <td>{item.reservable?.name}</td>
                                                <td>{new Date(item.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                                <td>{item.startTime} - {item.endTime}</td>
                                                <td>{item.reservableType === 'EQUIPMENT' ? 'Equipo' : 'Espacio'}</td>
                                                <td>
                                                    <span className={`${tableStyles.badge} ${statusInfo.className}`}>
                                                        {statusInfo.text}
                                                    </span>
                                                </td>
                                                <td className={tableStyles.actions}>
                                                    <button
                                                        className={tableStyles.viewButton}
                                                        onClick={() => navigate(`/requests/${item.id}`)}
                                                    >
                                                        <FiEye />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: "center", padding: "40px" }}>
                                            No se encontraron reservaciones
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