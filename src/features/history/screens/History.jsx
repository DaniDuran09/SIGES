import styles from "../styles/History.module.css";
import tableStyles from "../styles/HistoryData.module.css";
import { FiRefreshCw } from "react-icons/fi";
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
    const [type, setType] = useState(""); // Agregado para el segundo filtro
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

            if (search) params.petitionerName = search;
            if (status !== "") params.status = status;
            if (type !== "") params.type = type; // Enviando el parámetro type a la API
            if (date !== "") params.date = date;

            return apiFetch("/reservations", {
                method: "GET",
                params: params,
            });
        },
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
                        placeholder="Buscar por solicitante..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(0);
                        }}
                    />

                    <div className={styles.componentSearch}>

                        <input
                            className={styles.date}
                            type="date"
                            value={date}
                            onChange={(e) => {
                                setDate(e.target.value);
                                setPage(0);
                            }}
                        />

                        <div className={styles.optionAndState}>
                            <Filter

                                value={status}
                                onChange={(e) => {
                                    setStatus(e.target.value);
                                    setPage(0);
                                }}
                                options={statusOptions}
                            />

                            <Filter

                                value={type}
                                onChange={(e) => {
                                    setType(e.target.value);
                                    setPage(0);
                                }}
                                options={typeOptions}
                            />


                            <button
                                className={styles.refreshIcon}
                                title="Refrescar"
                                onClick={() => refetch()}
                            >
                                <FiRefreshCw />
                            </button>
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
                                    <th>Solicitante</th>
                                    <th>Recurso</th>
                                    <th>Fecha</th>
                                    <th>Horario</th>
                                    <th>Estatus</th>
                                    <th>Tipo</th>
                                </tr>
                                </thead>
                                <tbody>
                                {b_history?.content?.length > 0 ? (
                                    b_history.content.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.id}</td>
                                            <td className={tableStyles.name}>
                                                {item.petitioner?.firstName} {item.petitioner?.lastName}
                                            </td>
                                            <td>{item.reservable?.name}</td>
                                            <td>{item.date}</td>
                                            <td>{item.startTime} - {item.endTime}</td>
                                            <td>
                                                <span className={`${tableStyles.badge} ${
                                                    item.status === 'FINISHED' || item.status === 'APPROVED' ? tableStyles.completada :
                                                        item.status === 'CANCELLED' || item.status === 'REJECTED' ? tableStyles.cancelada : ''
                                                }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td>{item.type}</td>
                                        </tr>
                                    ))
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