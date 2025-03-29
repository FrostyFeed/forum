import Categories from '../components/categories.jsx';
import Latest_threads from '../components/latest_threads.jsx';
import styles from '../components/styles/global.module.css'
export default function Main() {
    return (
        <main className={`${styles.container} ${styles.mainContent}`}>
            <Categories />
            <Latest_threads />
        </main>
    )
}