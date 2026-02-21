import styles from '../styles/PendingRequestComponent.module.css';
// import PendingRequest from '../../Types';

function PendingRequestComponent({ props }) {
    const {
        ApplierName,
        objectName,
        date,
    } = props;
    return (
        <div className={styles.pendingRequestCard}>
            <p className={styles.applierName}>{ApplierName}</p>
            <div className={styles.infoContainer}>
                <h1 className={styles.objectName}>{objectName}</h1>
                <p className={styles.date}>{date}</p>
            </div>
        </div>
    );
}
export default PendingRequestComponent;