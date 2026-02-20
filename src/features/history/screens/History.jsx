import styles from "./History.module.css"

function History() {
    return(
        <div className={styles.container}>

            <div className={styles.header}>

                <h4>
                    Gestión
                </h4>
                <h1>
                    Historial
                </h1>

                <div className={styles.searchBar}>

                    <input className={styles.search} type="search"/>

                    <div className={styles.componentSearch}>

                        <input className={styles.date} type="datetime-local"/>

                        <select className={styles.state} id="opciones" name="estado">
                            <option value="opcion1">1</option>
                            <option value="opcion2">0</option>
                        </select>

                        <select className={styles.sort} id="opciones" name="tipo">
                            <option value="opcion1">Opción 1</option>
                            <option value="opcion2">Opción 2</option>
                            <option value="opcion3">Opción 3</option>
                        </select>

                    </div>

                </div>


            </div>

            <div className={styles.body}>
                hola

            </div>

        </div>
)
}
export default History;