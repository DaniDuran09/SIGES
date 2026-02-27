import styles from '../styles/HistoryData.module.css';


function HistoryData({props}) {
    const {id, name, resource, requestData, useDate, status, resolveBy} = props;
return(
    <div className={styles.historyTable}>
        <p className={styles.idTable}>{id}</p>
        <p className={styles.nameTable}>{name}</p>
        <p className={styles.resourceTable}>{resource}</p>
        <p className={styles.requestDataTable}>{requestData}</p>
        <p className={styles.useDateTable}>{useDate}</p>
        <p className={styles.statusTable}>{status}</p>
        <p className={styles.resolveByTable}>{resolveBy}</p>

    </div>
)
}
export default HistoryData;