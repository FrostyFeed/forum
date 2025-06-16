
import styles from '../styles/users.module.css'
import Activite from './activite.jsx'
export default function RecentActivity({ activity }) {
    return (
        <section className={styles.activitySection}>
            <div className={styles.activityHeader}>Остання активність</div>
            <Activite activite={activity} />
        </section>
    )
}