import { IoMdNotificationsOutline } from "react-icons/io";
import styles from '../styles/Home.module.css';
import { FiPlus } from "react-icons/fi";
import { FaBuilding } from "react-icons/fa";
import { Colors } from "../../../assets/Colors";
import { PiBuildingsBold } from "react-icons/pi";
import StatsComponent from "../components/StatsComponent.jsx";
import PendingRequestComponent from "../components/PendingRequestComponent.jsx";
import { NewSpaceModal } from "../../spaces/components/NewSpaceModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../../api/client.js";
import { Alert } from "@mui/material";
import LoaderCircle from "../../../assets/components/LoaderCircle.jsx";

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

function Home() {
    const [modalVisible, setModalVisible] = useState(false);
    const navigate = useNavigate();

    const {
        data,
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

    const options = data ? [
        {
            name: 'SOLICITUDES PENDIENTES',
            number: data.pendingRequests ?? 0,
            stats: `${data.pendingRequestsPercentage ?? 0}%`,
            type: (data.pendingRequestsDiffYesterday ?? 0) >= 0 ? 'positive' : 'negative'
        },
        {
            name: 'ESPACIOS DISPONIBLES',
            number: `${data.availableSpaces ?? 0}/${data.totalSpaces ?? 0}`,
            stats: `${data.availableSpacesPercentage ?? 0}%`,
            type: (data.availableSpacesDiffYesterday ?? 0) >= 0 ? 'positive' : 'negative'
        },
        {
            name: 'EQUIPOS EN USO',
            number: `${data.inUseEquipments ?? 0}/${data.totalEquipments ?? 0}`,
            stats: `${data.inUseEquipmentsPercentage ?? 0}%`,
            type: (data.inUseEquipmentsDiffYesterday ?? 0) >= 0 ? 'positive' : 'negative'
        },
        {
            name: 'RESERVACIONES HOY',
            number: data.todayReservations ?? 0,
            stats: `${(data.todayReservationsDiffAvg ?? 0) >= 0 ? '+' : ''}${data.todayReservationsDiffAvg ?? 0} VS PROMEDIO`,
            type: (data.todayReservationsDiffAvg ?? 0) >= 0 ? 'positive' : 'negative'
        },
    ] : [];

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
                        {true && (
                            <div style={{ width: '15px', height: '15px', backgroundColor: '#FF9B85', borderRadius: '50%', position: 'absolute', top: '5px', right: '5px' }} />
                        )}
                        <IoMdNotificationsOutline style={{ width: '30px', height: '30px' }} />
                    </button>
                    <div>
                        <button className={styles.newRequestButton}>
                            <FiPlus style={{ width: '25px', height: '25px', color: 'white' }} />
                            <h3 className={styles.newRequestText}>
                                Nueva Solicitud
                            </h3>
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.statsGrid}>
                {options.map((option, index) => (
                    <StatsComponent key={index} props={option} />
                ))}
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

                <div className={styles.quickActionsContainer} >
                    <h3>Acciones rapidas</h3>
                    <div className={styles.quickActionsGrid} >
                        <button onClick={() => { setModalVisible(true) }} className={styles.quickActionButton} style={{ backgroundColor: Colors.primaryColor }} >
                            <div style={{ flex: 1, display: 'flex', justifyContent: 'left' }}  >
                                <PiBuildingsBold size={50} />
                            </div>
                            <div style={{ flex: 1, flexDirection: 'column' }} >
                                <h2 style={{ display: 'flex', justifyContent: 'left', fontSize: '16px' }} >Registrar Espacio</h2>
                                <h2 style={{ display: 'flex', justifyContent: 'left', fontSize: '16px' }} >Agregar un nuevo espacio</h2>
                            </div>
                        </button>

                        <button className={styles.quickActionButton} style={{ backgroundColor: '#D4F1E8' }} >
                            <div style={{ flex: 1, display: 'flex', justifyContent: 'left' }}  >
                                <PiBuildingsBold size={50} />
                            </div>
                            <div style={{ flex: 1, flexDirection: 'column' }} >
                                <h2 style={{ display: 'flex', justifyContent: 'left', fontSize: '16px' }} >Registrar Espacio</h2>
                                <h2 style={{ display: 'flex', justifyContent: 'left', fontSize: '16px' }} >Agregar un nuevo espacio</h2>
                            </div>
                        </button>

                        <button className={styles.quickActionButton} style={{ backgroundColor: '#FFF4D4' }} >
                            <div style={{ flex: 1, display: 'flex', justifyContent: 'left' }}  >
                                <PiBuildingsBold size={50} />
                            </div>
                            <div style={{ flex: 1, flexDirection: 'column' }} >
                                <h2 style={{ display: 'flex', justifyContent: 'left', fontSize: '16px' }} >Registrar Espacio</h2>
                                <h2 style={{ display: 'flex', justifyContent: 'left', fontSize: '16px' }} >Agregar un nuevo espacio</h2>
                            </div>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Home;