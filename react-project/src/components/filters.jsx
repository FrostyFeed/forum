import styles from './styles/topic.module.css'
export default function Filters({ setFilter, sortBy, setPage, mountRef }) {
    return (
        <div className={styles.filtersRow}>
            <div className={styles.filterDropdown}>
                <span>Фільтрація:</span>
                <select
                    onChange={(e) => setFilter(e.target.value)}
                    value={sortBy}
                >
                    <option value="creationDate,desc">Спочатку новіші</option>
                    <option value="creationDate,asc">Спочатку старіші</option>
                </select>
            </div>
        </div>
    )
}