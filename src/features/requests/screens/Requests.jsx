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
    const [status, setStatus] = useState("");
    const [tipo, setTipo] = useState("");
    const [fechaDesde, setFechaDesde] = useState("");

    const opcionesTipo = [
        { value: "", text: "Tipo: Todos" },
        { value: "EQUIPMENT", text: "Equipo" },
        { value: "SPACE", text: "Espacio" }
    ];

    const {
        data: b_requests,
        isPending,
        error,
        refetch
    } = useQuery({
        queryKey: ["GetRequests", search, status, page, tipo, fechaDesde],
        queryFn: () => {
            const params = {
                page: page,
                size: 20
            };
            if (search) params.searchQuery = search;
            if (status) params.statuses = status; // Correción a 'statuses' acorde a /reservations
            if (tipo) params.reservableType = tipo;
            if (fechaDesde) params.dateFrom = fechaDesde;

            return apiFetch("/reservations", {
                method: "GET",
                params: params,
            });
        },
        retry: (failureCount, error) => error.status !== 404,
    });

    const getStatusInfo = (status) => {
        switch (status) {
            case 'PENDING': return { className: tableStyles.pendiente, text: 'Pendiente' };
            case 'APPROVED': return { className: tableStyles.aprobada, text: 'Aprobada' };
            case 'DENIED':
            case 'REJECTED': return { className: tableStyles.denegada, text: 'Denegada' };
            case 'COMPLETED':
            case 'FINISHED': return { className: tableStyles.completada, text: 'Completada' };
            case 'CANCELLED': return { className: tableStyles.completada, text: 'Cancelada' };
            default: return { className: tableStyles.completada, text: status };
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
                        <button className={status === "" ? styles.active : ""} onClick={() => { setStatus(""); setPage(0); }}>Todas</button>
                        <button className={status === "PENDING" ? styles.active : ""} onClick={() => { setStatus("PENDING"); setPage(0); }}>Pendientes</button>
                        <button className={status === "APPROVED" ? styles.active : ""} onClick={() => { setStatus("APPROVED"); setPage(0); }}>Aprobadas</button>
                        <button className={status === "REJECTED" || status === "DENIED" ? styles.active : ""} onClick={() => { setStatus("REJECTED"); setPage(0); }}>Denegadas</button>
                        <button className={status === "CANCELLED" ? styles.active : ""} onClick={() => { setStatus("CANCELLED"); setPage(0); }}>Canceladas</button>
                    </div>
                </div>

                <div className={styles.searchBar}>
                    <SearchBar
                        type="search"
                        placeholder="Buscar Solicitudes..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                    />

                    <div className={styles.optionAndState}>
                        <button
                            className={styles.refreshIcon}
                            title="Refrescar"
                            onClick={() => refetch()}
                        >
                            <FiRefreshCw />
                        </button>

                        <input
                            type="date"
                            className={styles.filterInput}
                            title="Desde"
                            value={fechaDesde}
                            onChange={(e) => { setFechaDesde(e.target.value); setPage(0); }}
                        />

                        {/*
                        <Filter
                            value={tipo}
                            onChange={(e) => { setTipo(e.target.value); setPage(0); }}
                            options={opcionesTipo}
                        />
                        */}
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
                                    <th>Fecha Reservación</th>
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
                                        const reservationDate = item.date ? new Date(item.date + 'T00:00:00') : null;

                                        return (
                                            <tr key={item.id}>
                                                <td className={tableStyles.usuario}>
                                                    {(item.petitioner?.firstName || item.user?.firstName)} {(item.petitioner?.lastName || item.user?.lastName)}
                                                </td>
                                                <td>{item.reservable?.name}</td>
                                                <td>
                                                    {reservationDate
                                                        ? reservationDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
                                                        : 'No definida'}
                                                </td>
                                                <td>{item.startTime} - {item.endTime}</td>
                                                <td>{item.reservableType === 'EQUIPMENT' ? 'Equipo' : 'Espacio'}</td>
                                                <td>
                                                    <span className={`${tableStyles.badge} ${statusInfo.className}`}>
                                                        {statusInfo.text}
                                                    </span>
                                                </td>
                                                <td className={tableStyles.actions}>
                                                    <button className={tableStyles.viewButton} onClick={() => navigate(`/requests/${item.id}`)}>
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