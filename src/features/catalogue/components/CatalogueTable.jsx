import { FiEdit2, FiTrash2 } from "react-icons/fi";
import styles from "../styles/Catalogue.module.css";

const CatalogueTable = ({ data, onEdit, onDelete, isLoading }) => {
    if (isLoading) {
        return <div style={{ padding: "40px", textAlign: "center" }}>Cargando datos...</div>;
    }

    if (!data || data.length === 0) {
        return <div style={{ padding: "40px", textAlign: "center", color: "#64748B" }}>No se encontraron registros.</div>;
    }

    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.description || "-"}</td>
                            <td>
                                <div className={styles.actions}>
                                    <button
                                        className={`${styles.iconButton} ${styles.editBtn}`}
                                        onClick={() => onEdit(item)}
                                        title="Editar"
                                    >
                                        <FiEdit2 size={16} />
                                    </button>
                                    <button
                                        className={`${styles.iconButton} ${styles.deleteBtn}`}
                                        onClick={() => onDelete(item)}
                                        title="Eliminar"
                                        style={{ color: "#EF4444" }}
                                    >
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CatalogueTable;
