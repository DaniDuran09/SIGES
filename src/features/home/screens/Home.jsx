import { IoMdNotificationsOutline } from "react-icons/io";
import styles from './Home.module.css';
import { FiPlus } from "react-icons/fi";
import Building_04 from '../../../assets/icons/Building_04.svg';
import { Colors } from "../../../assets/Colors";

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
                    <div key={index} className={styles.statCard}>
                        <h5>{option.name}</h5>
                        <h1 style={{ fontSize: '36px', margin: '10px 0' }}>{Number(option.number).toFixed(1)}</h1>
                        <p style={{
                            color: option.type === 'positive' ? 'green' : 'red',
                            fontWeight: 'bold',
                            fontSize: '0.9rem'
                        }} >{option.stats}</p>
                    </div>
                ))}
            </div>
            <div
                className={styles.bottomSection}>
                {/*SOLICITUDES PENDIENTES */}
                <div style={{ flex: 2, height: '100%', backgroundColor: 'white', borderRadius: '10px', border: '1px solid #ddd', padding: '10px' }}>
                    <div className={styles.ResponsiveTitleContainer}>
                        <h3 style={{}}>Solicitudes pendientes {'>'}</h3>
                    </div>
                    {options.map((option, index) => (
                        <div key={index} className={styles.statCard}>
                            <h3>{option.name}</h3>
                            <h1 style={{ fontSize: '36px', margin: '10px 0' }}>{Number(option.number).toFixed(1)}</h1>
                            <p style={{
                                color: option.type === 'positive' ? 'green' : 'red',
                                fontWeight: 'bold',
                                fontSize: '0.9rem'
                            }} >{option.stats}</p>
                        </div>
                    ))}

                </div>
                <div className={styles.quickActionsContainer} >
                    <h3>Acciones rapidas</h3>
                    {/*AQUI VAN LAS SOLICITUDES PENDIENTES*/}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} >
                        <button className={styles.quickActionButton} style={{ backgroundColor: Colors.primaryColor }} >
                            <div style={{ flex: 1, display: 'flex', justifyContent: 'left' }}  >
                                <img src={Building_04} alt="" />
                            </div>
                            <div style={{ flex: 1, flexDirection: 'column' }} >
                                <h2 style={{ display: 'flex', justifyContent: 'left' }} >Registrar Espacio</h2>
                                <h2 style={{ display: 'flex', justifyContent: 'left' }} >Agregar un nuevo espacio</h2>

                            </div>
                        </button>

                        <button className={styles.quickActionButton} style={{ backgroundColor: '#D4F1E8' }} >
                            <div style={{ flex: 1, display: 'flex', justifyContent: 'left' }}  >
                                <img src={Building_04} alt="" />
                            </div>
                            <div style={{ flex: 1, flexDirection: 'column' }} >
                                <h2 style={{ display: 'flex', justifyContent: 'left' }} >Registrar Espacio</h2>
                                <h2 style={{ display: 'flex', justifyContent: 'left' }} >Agregar un nuevo espacio</h2>

                            </div>
                        </button>

                        <button className={styles.quickActionButton} style={{ backgroundColor: '#FFF4D4' }} >
                            <div style={{ flex: 1, display: 'flex', justifyContent: 'left' }}  >
                                <img src={Building_04} alt="" />
                            </div>
                            <div style={{ flex: 1, flexDirection: 'column' }} >
                                <h2 style={{ display: 'flex', justifyContent: 'left' }} >Registrar Espacio</h2>
                                <h2 style={{ display: 'flex', justifyContent: 'left' }} >Agregar un nuevo espacio</h2>

                            </div>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}
export default Home;