import styles from "./Filter.module.css";

const Filter = ({ value, onChange, options = [] }) => {
    return (
        <select
            className={styles.selectField}
            value={value}
            onChange={onChange}
        >

            {options?.map((opt, i) => (
                <option key={i} value={opt.value}>
                    {opt.text}
                </option>
            ))}
        </select>
    );
};

export default Filter;