import { FiSearch } from "react-icons/fi";
import styles from "./SearchBar.module.css";

function SearchBar({ value, onChange, placeholder = "Buscar..." }) {
    return (
        <div className={styles.searchContainer}>
            <FiSearch className={styles.searchIcon} />
            <input
                className={styles.search}
                type="search"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}

export default SearchBar;