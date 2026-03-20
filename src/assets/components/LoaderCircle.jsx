import styles from "./LoaderCircle.module.css";

function LoaderCircle() {
    return (
        <div className={styles.container}>
            <div className={styles.loader}>
                <div className={styles.loaderCircle}></div>
            </div>
        </div>
    );
}

export default LoaderCircle;
