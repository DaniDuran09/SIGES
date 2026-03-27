import styles from "../styles/History.module.css";
import tableStyles from "../styles/HistoryData.module.css";
import {FiRefreshCw, FiSearch} from "react-icons/fi";
import { useState } from "react";
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
    const [page, setPage] = useState(0);

    const opcionesEstado = [
        { value: "All", text: "Todos" },
        { value: "ACTIVE", text: "Completada" },
        { value: "INACTIVE", text: "Cancelada" },
        { value: "INCOMPLETE", text: "Denegada" }

    ];
    const opcionesOrdenar = [
        { value: "ACTIVE", text: "Fecha" },
        { value: "INACTIVE", text: "Nombre" }

    ];

    const {
        data: b_history,
        isPending,
        error
    } = useQuery({
        queryKey: ["GetHistory", search, status, page],
        queryFn: () =>
            apiFetch("/history", {
                method: "GET",
                params: {
                    searchQuery: search,
                    status: status,
                    page: page,
                    size: 20
                },
            }),
        retry: (failureCount, error) => error.status !== 404,
    });

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
                        placeholder="Buscar en Historial..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <button className={styles.refreshIcon} title="Refrescar">
                        <FiRefreshCw />
                    </button>

                    <div className={styles.componentSearch}>
                        <input className={styles.date} type="datetime-local" />

                        <div className={styles.optionAndState}>


                            <Filter
                                label="Estado"
                                value=""
                                onChange={(e) => setStatus(e.target.value)}
                                options={opcionesEstado}
                            />

                            <Filter
                                label="Tipo"
                                value=""
                                onChange={(e) => setStatus(e.target.value)}
                                options={opcionesOrdenar}
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
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Recurso</th>
                                    <th>Fecha de solicitud</th>
                                    <th>Fecha de uso</th>
                                    <th>Estatus</th>
                                    <th>Resuelto por</th>
                                </tr>
                                </thead>

                                <tbody>
                                {b_history?.content?.length > 0 ? (
                                    b_history.content.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.id}</td>
                                            <td className={tableStyles.name}>{item.user?.firstName} {item.user?.lastName}</td>
                                            <td>{item.reservable?.name}</td>
                                            <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                                            <td>{item.startTime} - {item.endTime}</td>
                                            <td>
                                                    <span className={`${tableStyles.badge} ${
                                                        item.status === 'COMPLETED' ? tableStyles.completada :
                                                        item.status === 'CANCELLED' ? tableStyles.cancelada :
                                                        item.status === 'DENIED' ? tableStyles.denegada : 
                                                        ''
                                                    }`}>
                                                        {item.status === 'COMPLETED' ? 'Completada' :
                                                         item.status === 'CANCELLED' ? 'Cancelada' :
                                                         item.status === 'DENIED' ? 'Denegada' : item.status}
                                                    </span>
                                            </td>
                                            <td className={tableStyles.resolved}>{item.resolvedBy || "Sistema"}</td>
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
                            totalPages={b_history?.totalPages || 0} 
                            onPageChange={(newPage) => setPage(newPage)} 
                        />
                    </>
                )}
            </div>
        </div>
    );
}

export default History;