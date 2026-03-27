import styles from "./Filter.module.css";

const Filter = ({ label, value, onChange, options = [] }) => {
    return (
        <select
            className={styles.selectField}
            value={value}
            onChange={onChange}
        >
            <option value="">{label}</option>

            {options?.map((opt, i) => (
                <option key={i} value={opt.value}>
                    {opt.text}
                </option>
            ))}
        </select>
    );
};

export default Filter;