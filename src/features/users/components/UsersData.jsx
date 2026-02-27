import styles from '../styles/UsersData.module.css';

function UsersData({props}) {
    const {name, type, tuition, mail, phone, status} = props;
    return (
        <div className={styles.userRow}>
            <p className={styles.nameTable}>{name}</p>
            <p className={styles.typeTable}>{type}</p>
            <p className={styles.tuitionTable}>{tuition}</p>
            <p className={styles.mailTable}>{mail}</p>
            <p className={styles.phoneTable}>{phone}</p>
            <p className={styles.statusTable}>{status}</p>

        </div>
    )
}

export default UsersData;