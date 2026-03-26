import { IoMdNotificationsOutline } from "react-icons/io";
import styles from '../styles/Home.module.css';
import { FiPlus } from "react-icons/fi";
import { Colors } from "../../../assets/Colors";
import { PiBuildingsBold } from "react-icons/pi";
import StatsComponent from "../components/StatsComponent.jsx";
import PendingRequestComponent from "../components/PendingRequestComponent.jsx";
import { NewSpaceModal } from "../../spaces/components/NewSpaceModal";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../../api/client.js";
import { Alert } from "@mui/material";
import LoaderCircle from "../../../assets/components/LoaderCircle.jsx";
import PlusButton from "../../../assets/components/PlusButton.jsx";

function Home() {
    const [modalVisible, setModalVisible] = useState(false);
    const navigate = useNavigate();

    const {
        data: b_reports,
        isPending,
        error
    } = useQuery({
        queryKey: ["GetReports"],
        queryFn: () =>
            apiFetch(`/reports/dashboard`, {
                method: "GET",
            }),
        retry: (failureCount, error) => error.status !== 404,
    });

    useEffect(() => {
        if (b_reports) {
            console.log("backend reports : ", b_reports);
        }
    }, [b_reports]);

    if (error && error.status !== 404) {
        return (
            <div className={styles.container}>
                <Alert severity="error">
                    Error al cargar los reportes: {error.message}
                </Alert>
            </div>
        );
    }

    if (isPending) {
        return <LoaderCircle />;
    }

    const reports = b_reports ?? {};

    const pendingRequests = [
        {
            ApplierName: 'Juan Perez',
            objectName: 'Aula 101',
            date: '2022-01-01'
        },
        {
            ApplierName: 'Maria Lopez',
            objectName: 'Aula 102',
            date: '2022-01-02'
        },
        {
            ApplierName: 'Pedro Ramirez',
            objectName: 'Aula 103',
            date: '2022-01-03'
        },
    ];

    return (
        <div className={styles.container}>

            {modalVisible && <NewSpaceModal onClose={() => setModalVisible(false)} />}
            <h4 style={{ paddingLeft: '10px', margin: '10px 0' }}>Buenos dias</h4>

            <div className={styles.topBar}>
                <div className={styles.titleSection}>
                    <h1 className={styles.title}>Panel de control</h1>
                </div>
                <div className={styles.actionsSection}>
                    <button className={styles.notificationButton}>
                        {reports.pendingRequests > 0 && (
                            <div style={{ width: '15px', height: '15px', backgroundColor: '#FF9B85', borderRadius: '50%', position: 'absolute', top: '5px', right: '5px' }} />
                        )}
                        <IoMdNotificationsOutline style={{ width: '30px', height: '30px' }} />
                    </button>
                    <div>
                        <PlusButton
                            text="Nueva Solicitud"
                        />
                    </div>
                </div>
            </div>

            <div className={styles.statsGrid}>
                <StatsComponent props={{
                    name: "Solicitudes pendientes",
                    number: reports.pendingRequests ?? 0,
                    stats: (reports.pendingRequestsDiffYesterday ?? 0) === 0
                        ? "Sin cambios"
                        : (reports.pendingRequestsDiffYesterday > 0
                            ? `+${reports.pendingRequestsDiffYesterday} respecto a ayer`
                            : `${reports.pendingRequestsDiffYesterday} respecto a ayer`),
                    type: (reports.pendingRequestsDiffYesterday ?? 0) >= 0 ? 'positive' : 'negative'
                }} />

                <StatsComponent props={{
                    name: "Espacios disponibles",
                    number: reports.availableSpaces ?? 0,
                    stats: (reports.availableSpacesDiffYesterday ?? 0) === 0
                        ? "Sin cambios"
                        : (reports.availableSpacesDiffYesterday > 0
                            ? `+${reports.availableSpacesDiffYesterday} respecto a ayer`
                            : `${reports.availableSpacesDiffYesterday} respecto a ayer`),
                    type: (reports.availableSpacesDiffYesterday ?? 0) >= 0 ? 'positive' : 'negative'
                }} />

                <StatsComponent props={{
                    name: "Equipos en uso",
                    number: reports.inUseEquipments ?? 0,
                    stats: (reports.inUseEquipmentsDiffYesterday ?? 0) === 0
                        ? "Sin cambios"
                        : (reports.inUseEquipmentsDiffYesterday > 0
                            ? `+${reports.inUseEquipmentsDiffYesterday} respecto a ayer`
                            : `${reports.inUseEquipmentsDiffYesterday} respecto a ayer`),
                    type: (reports.inUseEquipmentsDiffYesterday ?? 0) >= 0 ? 'positive' : 'negative'
                }} />

                <StatsComponent props={{
                    name: "Reservaciones hoy",
                    number: reports.todayReservations ?? 0,
                    stats: (reports.todayReservationsDiffAvg ?? 0) === 0
                        ? "Sin cambios"
                        : (reports.todayReservationsDiffAvg > 0
                            ? `+${reports.todayReservationsDiffAvg} respecto al promedio`
                            : `${reports.todayReservationsDiffAvg} respecto al promedio`),
                    type: (reports.todayReservationsDiffAvg ?? 0) >= 0 ? 'positive' : 'negative'
                }} />
            </div>

            <div className={styles.bottomSection}>
                <div style={{ flex: 2, overflow: 'auto', display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'white', borderRadius: '10px', border: '1px solid #ddd', padding: '10px' }}>
                    <div className={styles.ResponsiveTitleContainer}>
                        <h3>Solicitudes pendientes</h3>
                        <button onClick={() => { navigate('/requests') }} style={{ backgroundColor: 'transparent', border: '0px', cursor: 'pointer' }}>
                            <h3 style={{ color: '#6B5B95' }}>Ver todas {'>'}</h3>
                        </button>
                    </div>
                    {pendingRequests.map((request, index) => (
                        <PendingRequestComponent key={index} props={request} />
                    ))}
                </div>

                <div className={styles.quickActionsContainer}>
                    <h3>Acciones rapidas</h3>
                    <div className={styles.quickActionsGrid}>
                        <button onClick={() => { setModalVisible(true) }} className={styles.quickActionButton} style={{ backgroundColor: Colors.primaryColor }}>
                            <div style={{ flex: 1, display: 'flex', justifyContent: 'left' }}>
                                <PiBuildingsBold size={50} />
                            </div>
                            <div style={{ flex: 1, flexDirection: 'column' }}>
                                <h2 style={{ display: 'flex', justifyContent: 'left', fontSize: '16px' }}>Registrar Espacio</h2>
                                <h2 style={{ display: 'flex', justifyContent: 'left', fontSize: '16px' }}>Agregar un nuevo espacio</h2>
                            </div>
                        </button>

                        <button className={styles.quickActionButton} style={{ backgroundColor: '#D4F1E8' }}>
                            <div style={{ flex: 1, display: 'flex', justifyContent: 'left' }}>
                                <PiBuildingsBold size={50} />
                            </div>
                            <div style={{ flex: 1, flexDirection: 'column' }}>
                                <h2 style={{ display: 'flex', justifyContent: 'left', fontSize: '16px' }}>Registrar Espacio</h2>
                                <h2 style={{ display: 'flex', justifyContent: 'left', fontSize: '16px' }}>Agregar un nuevo espacio</h2>
                            </div>
                        </button>

                        <button className={styles.quickActionButton} style={{ backgroundColor: '#FFF4D4' }}>
                            <div style={{ flex: 1, display: 'flex', justifyContent: 'left' }}>
                                <PiBuildingsBold size={50} />
                            </div>
                            <div style={{ flex: 1, flexDirection: 'column' }}>
                                <h2 style={{ display: 'flex', justifyContent: 'left', fontSize: '16px' }}>Registrar Espacio</h2>
                                <h2 style={{ display: 'flex', justifyContent: 'left', fontSize: '16px' }}>Agregar un nuevo espacio</h2>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;