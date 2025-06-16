import styles from '../styles/users.module.css'
import { formatRegisterDate } from '../util/dateFormat'
import adminStyles from '../styles/adminAnimation.module.css'
import clsx from 'clsx'
import formatDate from '../util/dateFormat'
export default function Sidebar({ user }) {
    return (
        <div className={styles.profileSidebar}>
            <div className={styles.profileAvatar}>
                <img src={`${user.avatarUrl}`} alt="TechGuru" />
            </div>
            <h1 className={clsx(
                styles.profileUsername,
                {
                    [adminStyles.adminLook]: user.isAdmin,
                    [adminStyles.adminAnimation]: user.isAdmin,
                }
            )}>{user.username}</h1>
            <div className={styles.profileStats}>
                <div className={styles.profileStatItem}>
                    <span className={styles.profileStatLabel}>Приєднався</span>
                    <span className={styles.profileStatValue}>{formatRegisterDate(user.registerDate)}</span>
                </div>
                <div className={styles.profileStatItem}>
                    <span className={styles.profileStatLabel}>Всього коментарів</span>
                    <span className={styles.profileStatValue}>{user.replyCount}</span>
                </div>
                <div className={styles.profileStatItem}>
                    <span className={styles.profileStatLabel}>Створено постів</span>
                    <span className={styles.profileStatValue}>{user.threadCount}</span>
                </div>
                <div className={styles.profileStatItem}>
                    <span className={styles.profileStatLabel}>Востаннє в мережі</span>
                    <span className={styles.profileStatValue}>{formatDate(user.lastSeen)}</span>
                </div>
                <div className={styles.profileStatItem}>
                    <span className={styles.profileStatLabel}>Репутація</span>
                    <span className={styles.profileStatValue}>{user.reputation}</span>
                </div>
            </div>
        </div>
    )
}