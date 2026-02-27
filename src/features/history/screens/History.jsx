import styles from "../styles/History.module.css"
import { FiSearch } from "react-icons/fi";
import StatsComponent from "../../home/components/StatsComponent.jsx";
import HistoryData from "../components/HistoryData.jsx";

const historyData = [
    {
        id: 1,
        name: 'Carlos Salgado Trujillo',
        resource: 'Computer Lab',
        requestDate: '2026-02-10',
        useDate: '2026-02-12',
        status: 'active',
        resolvedBy: 'Maria Lopez'
    },
    {
        id: 2,
        name: 'Kevin Arturo Porcayo Cervantes',
        resource: 'Projector',
        requestDate: '2026-02-08',
        useDate: '2026-02-09',
        status: 'active',
        resolvedBy: 'Juan Perez'
    },
    {
        id: 3,
        name: 'Yahir Fuentes Martinez',
        resource: 'Library Room',
        requestDate: '2026-02-05',
        useDate: '2026-02-07',
        status: 'inactive',
        resolvedBy: 'Ana Martinez'
    },
    {
        id: 4,
        name: 'Daniel Duran Torres',
        resource: 'HDMI Cable',
        requestDate: '2026-02-01',
        useDate: '2026-02-03',
        status: 'active',
        resolvedBy: 'Luis Hernandez'
    },
    {
        id: 5,
        name: 'Carlos Salgado Trujillo',
        resource: 'Sound Equipment',
        requestDate: '2026-01-28',
        useDate: '2026-01-30',
        status: 'inactive',
        resolvedBy: 'Sofia Ramirez'
    },
]

function History() {
    return (
        <div className={styles.container}>

            <div className={styles.header}>

                <h4>
                    Gestión
                </h4>

                <h1>
                    Historial
                </h1>

                <div className={styles.searchBar}>

                    <div className={styles.searchContainer}>

                        <FiSearch className={styles.searchIcon} />
                        <input
                            className={styles.search}
                            type="search"
                            placeholder="Buscar en historial..."
                        />

                    </div>

                    <div className={styles.componentSearch}>

                        <input className={styles.date} type="datetime-local" />

                        <div className={styles.optionAndState}>
                            <select className={styles.state} id="opciones" name="estado" >
                                <option value="">Estado: Tipo</option>
                                <option value="opcion1">1</option>
                                <option value="opcion2">0</option>
                            </select>

                            <select className={styles.sort} id="opciones" name="tipo">
                                <option value="">Tipo: Todos</option>
                                <option value="opcion1">Opción 1</option>
                                <option value="opcion2">Opción 2</option>
                                <option value="opcion3">Opción 3</option>
                            </select>
                        </div>

                    </div>

                </div>

            </div>

            <div className={styles.historyTable}>
                {historyData.map((historyData, index) => (
                    <HistoryData key={index} props={historyData} />
                ))}

            </div>

        </div>
    )
}
export default History;