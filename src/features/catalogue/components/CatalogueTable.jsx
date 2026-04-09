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
                        <th>Estado</th>
                        {/* <th>Acciones</th> */}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>
                                <span className={`${styles.statusBadge} ${item.deletedAt === null ? styles.activeBadge : styles.inactiveBadge}`}>
                                    {item.deletedAt === null ? "Activo" : "Inactivo"}
                                </span>
                            </td>
                            {/* 
                            <td>
                                <div className={styles.actions}>
                                    <label className={styles.switch} title={item.deletedAt === null ? "Desactivar" : "Activar"}>
                                        <input
                                            type="checkbox"
                                            checked={item.deletedAt === null}
                                            onChange={() => onDelete(item)}
                                        />
                                        <span className={styles.slider}></span>
                                    </label>
                                    <button
                                        className={`${styles.iconButton} ${styles.editBtn}`}
                                        onClick={() => onEdit(item)}
                                        title="Editar nombre"
                                    >
                                        <FiEdit2 size={16} />
                                    </button>
                                </div>
                            </td>
                            */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CatalogueTable;
