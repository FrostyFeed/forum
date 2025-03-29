import styles from './styles/last_threads.module.css';
import globalStyles from './styles/global.module.css';
export default function Latest_threads() {
    const threads = [
        {
            title: "Best mechanical keyboards for coding in 2025?",
            author: "TechGuru",
            category: "Technology",
            date: "March 20, 2025",
            views: 241,
            replies: 18
        },
        {
            title: "The future of AI: predictions for the next decade",
            author: "AIEnthusiast",
            category: "Science",
            date: "March 19, 2025",
            views: 387,
            replies: 32
        },
        {
            title: "New VR headset release discussion - worth buying?",
            author: "GameMaster",
            category: "Gaming",
            date: "March 18, 2025",
            views: 512,
            replies: 47
        },
        {
            title: "Book recommendations for science fiction lovers",
            author: "BookWorm",
            category: "Arts & Literature",
            date: "March 17, 2025",
            views: 198,
            replies: 24
        },
        {
            title: "Weekend movie night - what are you watching?",
            author: "CinemaFan",
            category: "Movies & TV",
            date: "March 16, 2025",
            views: 321,
            replies: 29
        }
    ];

    return (
        <section className={styles.latestThreadsSection}>
            <h2 className={globalStyles.sectionTitle}>Latest Threads</h2>
            <div className={styles.latestThreads}>
                {threads.map((thread, index) => (
                    <div key={index} className={styles.threadItem}>
                        <div className={styles.threadInfo}>
                            <div className={styles.threadTitle}>
                                <a href="#">{thread.title}</a>
                            </div>
                            <div className={styles.threadMeta}>
                                <span>By <a href="#">{thread.author}</a></span>
                                <span>In <a href="#">{thread.category}</a></span>
                                <span>{thread.date}</span>
                            </div>
                        </div>
                        <div className={styles.threadStats}>
                            <div>Views: {thread.views}</div>
                            <div>Replies: {thread.replies}</div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}