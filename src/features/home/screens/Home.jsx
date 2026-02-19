import { IoMdNotificationsOutline } from "react-icons/io";
import styles from './Home.module.css';

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
                            <h3 className={styles.newRequestText}>+ Nueva Solicitud</h3>
                        </button>
                    </div>
                </div>
            </div>

            {/* OPTIONS*/}
            <div className={styles.statsGrid}>
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

        </div>
    )
}
export default Home;