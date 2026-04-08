import { useNavigate } from 'react-router-dom';
import styles from '../styles/PendingRequestComponent.module.css';

function PendingRequestComponent({ request }) {
    const navigate = useNavigate();

    const {
        id,
        petitioner,
        user,
        reservable,
        createdAt,
        startTime,
        endTime,
        status
    } = request;

    const requester = petitioner || user;

    const getStatusInfo = (status) => {
        switch (status) {
            case 'PENDING':
                return { className: styles.pendiente, text: 'Pendiente' };
            case 'APPROVED':
                return { className: styles.aprobada, text: 'Aprobada' };
            case 'DENIED':
            case 'REJECTED':
                return { className: styles.denegada, text: 'Denegada' };
            case 'COMPLETED':
            case 'FINISHED':
                return { className: styles.completada, text: 'Completada' };
            case 'CANCELLED':
                return { className: styles.completada, text: 'Cancelada' };
            default:
                return { className: styles.completada, text: status };
        }
    };

    const statusInfo = getStatusInfo(status);
    const dateStr = new Date(createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
    const timeStr = `${startTime} - ${endTime}`;

    return (
        <div className={styles.pendingRequestCard} onClick={() => navigate(`/requests/${id}`)}>
            <div className={styles.leftSection}>
                <p className={styles.applierName}>{requester?.firstName} {requester?.lastName}</p>
                <div className={styles.infoContainer}>
                    <p className={styles.objectName}>{reservable?.name}</p>
                    <p className={styles.separator}>*</p>
                    <p className={styles.date}>{dateStr}, {timeStr}</p>
                </div>
            </div>
            <div className={styles.rightSection}>
                <span className={`${styles.badge} ${statusInfo.className}`}>
                    {statusInfo.text}
                </span>
            </div>
        </div>
    );
}

export default PendingRequestComponent;