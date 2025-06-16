import styles from '../styles/thread.module.css';
import dateFormatter from '../util/dateFormat.jsx'
import { useThread } from '../../context/ThreadContext.jsx';
export default function ThreadHeader({ thread }) {
    const { content } = useThread();
    console.log("Thread content:", content);
    const tittle = content?.title ?? thread.tittle;
    return (
        <div className={styles.threadHeader}>
            <h1 className={styles.threadTitle}>{tittle}</h1>
            <div className={styles.threadStats}>
                <div>{"Кількість коментарів: " + content.repliesCount}</div>
                <div>{"Дата створення: " + dateFormatter(thread.creationDate)}</div>
                <div>
                    {"Дата останнього коментаря: " + (content.lastReplyDate ? dateFormatter(content.lastReplyDate) : "Немає коментарів")}
                </div>
            </div>
        </div>
    )
}