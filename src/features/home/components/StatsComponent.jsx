import styles from '../styles/StatsComponent.module.css';

function StatsComponent({ props }) {
    const { name, number, stats, type } = props;
    return (
        <div className={styles.statCard}>
            <p className={styles.statCardTitle}>{name}</p>
            <p className={styles.statCardNumber}>{Number(number).toFixed(1)}</p>
            <p className={styles.statCardStats} style={{
                color: type === 'positive' ? 'green' : 'red',
                fontWeight: 'bold',
                fontSize: '0.9rem'
            }} >{stats}</p>
        </div>
    )
}

export default StatsComponent;