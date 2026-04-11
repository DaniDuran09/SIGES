import styles from "../styles/History.module.css";
import tableStyles from "../styles/HistoryData.module.css";
import { FiRefreshCw } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../../api/client";
import LoaderCircle from "../../../assets/components/LoaderCircle";
import { Alert } from "@mui/material";
import Pagination from "../../../assets/components/Pagination";
import SearchBar from "../../../assets/components/SearchBar.jsx";
import Filter from "../../../assets/components/Filter.jsx";

function History() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [type, setType] = useState("");
    const [date, setDate] = useState("");
    const [page, setPage] = useState(0);

    const statusOptions = [
        { value: "", text: "Estado: Todos" },
        { value: "FINISHED", text: "Completada" },
        { value: "APPROVED", text: "Aprobada" },
        { value: "PENDING", text: "Pendiente" },
        { value: "REJECTED", text: "Rechazada" },
        { value: "CANCELLED", text: "Cancelada" },
        { value: "IN_PROGRESS", text: "En curso" }
    ];

    const typeOptions = [
        { value: "", text: "Tipo: Todos" },
        { value: "SINGLE", text: "Individual" },
        { value: "GROUP", text: "Grupal" }
    ];

    const {
        data: b_history,
        isPending,
        error,
        refetch
    } = useQuery({
        queryKey: ["GetHistory", search, status, type, date, page],
        queryFn: () => {
            const params = {
                page: page,
                size: 20,
            };

            if (search) params.q = search;
            if (status) params.statuses = status;
            if (type) params.type = type;
            if (date) params.date = date;

            return apiFetch("/reservations", {
                method: "GET",
                params: params,
            });
        },
        retry: (failureCount, error) => error.status !== 404,
    });

    const itemCache = useRef({});

    useEffect(() => {
        if (!search && b_history?.content) {
            const newCache = { ...itemCache.current };
            b_history.content.forEach((item, index) => {
                const artificialId = (page * 20) + index + 1;
                newCache[artificialId] = { ...item, _artificialId: artificialId };
            });
            itemCache.current = newCache;
        }
    }, [b_history, search, page, status, type, date]);

    // Reseteo del caché cuando cambian filtros base
    useEffect(() => {
        itemCache.current = {};
    }, [status, type, date]);

    let displayHistory = b_history?.content || [];

    if (search && /^\d+$/.test(search.trim())) {
        const artificialId = parseInt(search.trim());
        const cachedItem = itemCache.current[artificialId];
        if (cachedItem && !displayHistory.some(h => h.id === cachedItem.id)) {
            displayHistory = [cachedItem, ...displayHistory];
        }
    }

    const getStatusStyles = (status) => {
        switch (status) {
            case 'FINISHED':
                return { className: tableStyles.completada, text: 'Completada' };
            case 'APPROVED':
                return { className: tableStyles.aprobada, text: 'Aprobada' };
            case 'REJECTED':
                return { className: tableStyles.denegada, text: 'Rechazada' };
            case 'CANCELLED':
                return { className: tableStyles.cancelada, text: 'Cancelada' };
            case 'PENDING':
                return { className: tableStyles.pendiente, text: 'Pendiente' };
            case 'IN_PROGRESS':
                return { className: tableStyles.pendiente, text: 'En curso' };
            default:
                return { className: tableStyles.cancelada, text: status };
        }
    };

    if (error && error.status !== 404) {
        return (
            <div className={styles.container}>
                <Alert severity="error">Error al cargar el historial: {error.message}</Alert>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h4>Gestión</h4>
                <h1>Historial</h1>

                <div className={styles.searchBar}>
                    <SearchBar
                        type="search"
                        placeholder="Buscar por solicitante..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(0);
                        }}
                    />

                    <div className={styles.filterGroup}>
                        <button
                            className={styles.refreshIcon}
                            title="Refrescar"
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

                        <input
                            className={styles.date}
                            type="date"
                            value={date}
                            onChange={(e) => {
                                setDate(e.target.value);
                                setPage(0);
                            }}
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
                                    <th style={{ textAlign: "center", width: "50px" }}>#</th>
                                    <th>Solicitante</th>
                                    <th>Recurso</th>
                                    <th>Fecha</th>
                                    <th>Horario</th>
                                    <th>Asistentes</th>
                                    <th>Estado</th>
                                    <th>Tipo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayHistory.length > 0 ? (
                                    displayHistory.map((item, index) => {
                                        const statusInfo = getStatusStyles(item.status);

                                        const companions = item.companions || 0;
                                        const totalAsistentes = 1 + companions;

                                        return (
                                            <tr key={item.id}>
                                                <td style={{ textAlign: 'center', color: '#6B7280', fontWeight: 'bold' }}>
                                                    {item._artificialId || (page * 20) + index + 1}
                                                </td>
                                                <td className={tableStyles.name}>
                                                    {(item.petitioner?.firstName || item.user?.firstName || "Usuario")}{" "}
                                                    {(item.petitioner?.lastName || item.user?.lastName || "")}
                                                </td>
                                                <td>{item.reservable?.name}</td>
                                                <td>{item.date}</td>
                                                <td>{item.startTime} - {item.endTime}</td>

                                                <td>{totalAsistentes}</td>

                                                <td>
                                                    <span className={`${tableStyles.badge} ${statusInfo.className}`}>
                                                        {statusInfo.text}
                                                    </span>
                                                </td>
                                                <td>{item.type === 'GROUP' ? 'Grupal' : 'Individual'}</td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="8" style={{ textAlign: "center", padding: "40px" }}>
                                            No se encontraron reservaciones
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <Pagination
                        currentPage={page}
                        totalPages={b_history?.totalPages || 0}
                        onPageChange={(newPage) => setPage(newPage)}
                    />
                </>
            )}
        </div>
    );
}

export default History;