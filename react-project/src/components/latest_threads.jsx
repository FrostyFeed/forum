import styles from './styles/last_threads.module.css';
import globalStyles from './styles/global.module.css';
import formatDate from './util/dateFormat';
import { Link } from 'react-router-dom';
export default function Latest_threads({ threads }) {
    console.log(threads)
    return (
        <section className={styles.latestThreadsSection}>
            <h2 className={globalStyles.sectionTitle}>Останні пости</h2>
            <div className={styles.latestThreads}>
                {threads.map((thread, index) => (
                    <div key={index} className={styles.threadItem}>
                        <div className={styles.threadInfo}>
                            <div className={styles.threadTitle}>
                                <Link to={`/thread/${thread.id}`}>{thread.tittle}</Link>
                            </div>
                            <div className={styles.threadMeta}>
                                <span>
                                    Користувач {thread.userId == 24
                                        ? thread.userName
                                        : <Link to={`/user/${thread.userId}`}>{thread.userName}</Link>}
                                </span>
                                <span>Категорія <Link to={`/topic/${thread.topicId}`}>{thread.topicTittle}</Link></span>
                                <span>{formatDate(thread.creationDate)}</span>
                            </div>
                        </div>
                        <div className={styles.threadStats}>
                            <div>Відповіді {thread.repliesCount}</div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}