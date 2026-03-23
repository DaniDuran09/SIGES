import styles from "./PlusButton.module.css";
import { FiPlus } from "react-icons/fi";

function PlusButton({ text, onClick }) {
    return (
        <button className={styles.PlusButton} onClick={onClick}>
            <FiPlus className={styles.icon} />
            <span className={styles.newText}
            >{text}</span>
        </button>
    );
}

export default PlusButton;