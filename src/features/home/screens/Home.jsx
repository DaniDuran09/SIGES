import { IoMdNotificationsOutline } from "react-icons/io";
import styles from '../styles/Home.module.css';
import { FiPlus } from "react-icons/fi";
import { FaBuilding } from "react-icons/fa";
import { Colors } from "../../../assets/Colors";
import { PiBuildingsBold } from "react-icons/pi";
import StatsComponent from "../components/StatsComponent.jsx";
import PendingRequestComponent from "../components/PendingRequestComponent.jsx";

const options = [
    {
        name: 'SOLICITUDES PENDIENTES',
        number: 5,
        stats: '20%',
        type: 'positive'
    },
    {
        name: 'ESPACIOS DISPONIBLES',
        number: 8 / 5,
        stats: '+3 DESDE AYER',
        type: 'positive'
    },
    {
        name: 'ESPACIOS DISPONIBLES',
        number: 8 / 5,
        stats: '+3 DESDE AYER',
        type: 'positive'
    },
    {
        name: 'ESPACIOS DISPONIBLES',
        number: 8 / 5,
        stats: '-3 DESDE AYER',
        type: 'negative'
    },
]

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
]

function Home() {
    return (
        <div className={styles.container}>

            <h4 style={{ paddingLeft: '10px', margin: '10px 0' }}>Buenos dias</h4>
            {/*TOP BAR*/}

            <div className={styles.topBar}>
                <div className={styles.titleSection}>
                    <h1 className={styles.title}>Panel de control</h1>
                </div>
                <div className={styles.actionsSection}>
                    <button className={styles.notificationButton}>
                        {/*NOTIFICATIONS */}
                        {true && (
                            <div style={{ width: '15px', height: '15px', backgroundColor: '#FF9B85', borderRadius: '50%', position: 'absolute', top: '5px', right: '5px' }} />
                        )}
                        <IoMdNotificationsOutline style={{ width: '30px', height: '30px' }} />
                    </button>
                    <div>
                        <button className={styles.newRequestButton}>
                            <FiPlus style={{ width: '25px', height: '25px', color: 'white' }} />
                            <h3 className={styles.newRequestText}>
                                Nueva Solicitud</h3>
                        </button>
                    </div>
                </div>
            </div>

            {/* OPTIONS*/}
            <div className={styles.statsGrid}>
                {options.map((option, index) => (
                    <StatsComponent key={index} props={option} />
                ))}
            </div>

            <div
                className={styles.bottomSection}>
                {/*SOLICITUDES PENDIENTES */}
                <div style={{ flex: 2, overflow: 'auto', display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'white', borderRadius: '10px', border: '1px solid #ddd', padding: '10px' }}>
                    <div className={styles.ResponsiveTitleContainer}>
                        <h3 style={{}}>Solicitudes pendientes {'>'}</h3>
                    </div>
                    {pendingRequests.map((request, index) => (
                        <PendingRequestComponent key={index} props={request} />

                    ))}

                </div>
                <div className={styles.quickActionsContainer} >
                    <h3>Acciones rapidas</h3>
                    {/*AQUI VAN LAS SOLICITUDES PENDIENTES*/}
                    <div className={styles.quickActionsGrid} >
                        <button className={styles.quickActionButton} style={{ backgroundColor: Colors.primaryColor }} >
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