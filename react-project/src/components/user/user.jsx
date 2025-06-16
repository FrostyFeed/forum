import styles from '../styles/users.module.css'
import globalStyles from '../styles/global.module.css'
import Sidebar from './sidebar'
import RecentActivity from './recentActivite'
export default function User({ data }) {
    console.log("User data:", data)
    return (
        <main className={`${globalStyles.container} ${globalStyles.mainContent}`}>
            <div className={styles.profileContainer}>
                <Sidebar user={data.user} />
                <div className={styles.profileContent}>
                    <RecentActivity activity={data.latest} />
                </div>
            </div>
        </main>
    )
}