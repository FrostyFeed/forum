import styles from './styles/topic.module.css'
import { Link } from 'react-router-dom'
import { parseISO, format } from 'date-fns'
import { uk } from 'date-fns/locale';
import { useAuth } from "../context/AuthContext.jsx"
export default function ThreadList({ threads }) {

    function formatDate(dateString) {
        const date = parseISO(dateString);
        return format(date, "d MMMM yyyy 'р. о' HH:mm ", { locale: uk })
    }
    return (
        <div className={styles.threadsList}>
            {threads.content.map((thread, index) => (
                < div key={index} className={styles.threadItem} >
                    <div className={styles.threadIcon}><img src={`${thread.avatarUrl}`} alt="avatar" /></div>
                    <div className={styles.threadContent}>
                        <div className={styles.threadTitle}><Link to={`/thread/${thread.id}`}>{thread.tittle}</Link></div>
                        <div className={styles.threadMeta}>
                            <span>Користувач {thread.userId == 24
                                ? thread.userName
                                : <Link to={`/user/${thread.userId}`}>{thread.userName}</Link>}

                            </span>
                            <span>{formatDate(thread.creationDate)}</span>
                        </div>
                    </div>
                    <div className={styles.threadStats}>
                        <div><span className={styles.icon}>💬</span> {thread.repliesCount}</div>
                    </div>
                </div>
            ))
            }
        </div >
    )
}