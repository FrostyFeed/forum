
import { Link } from 'react-router-dom'
import styles from '../styles/users.module.css'
import DOMPurify from 'dompurify';
import formatDate from '../util/dateFormat';
export default function Activite({ activite }) {
    console.log("Activite data:", activite)
    return (
        activite.map((activity, index) => (
            <div key={index} className={styles.activityItem}>
                <div className={styles.activityType}><Link to={`/thread/${activity.threadId}`}><span className={styles.activityType}>{activity.type}</span></Link></div>
                <div className={styles.activityContent}>
                    <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(activity.content) }}></p>
                </div>
                <div className={styles.activityMeta}>
                    <span>{formatDate(activity.creationDate)}</span>
                    <Link to={`/topic/${activity.topicId}`}>{activity.topicName}</Link>
                </div>
            </div>
        ))
    )
}