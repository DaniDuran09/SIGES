import styles from '../styles/StatsComponent.module.css';

function StatsComponent({ props, title, value }) {
    const name = props?.name ?? title ?? '';
    const number = props?.number ?? value ?? 0;
    const stats = props?.stats ?? '';
    const type = props?.type ?? 'positive';

    const safeNumber = isNaN(Number(number)) ? 0 : Number(number);

    return (
        <div className={styles.statCard}>
            <p className={styles.statCardTitle}>{name}</p>
            <p className={styles.statCardNumber}>{safeNumber}</p>
            <p
                className={styles.statCardStats}
                style={{
                    color: type === 'positive' ? 'green' : 'red',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                }}
            >
                {stats}
            </p>
        </div>
    );
}

export default StatsComponent;