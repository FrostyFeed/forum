import styles from './styles/categories.module.css';
import globalStyles from './styles/global.module.css';
export default function Categories() {
    const topics = [
        {
            title: "General Discussion",
            description: "Talk about anything and everything here.",
            threads: 1245,
            posts: 8723
        },
        {
            title: "Technology",
            description: "Discuss the latest tech news and gadgets.",
            threads: 984,
            posts: 6512
        },
        {
            title: "Gaming",
            description: "Share gaming experiences and discuss new releases.",
            threads: 1756,
            posts: 12897
        },
        {
            title: "Movies & TV",
            description: "Discuss your favorite shows, movies, and series.",
            threads: 856,
            posts: 5321
        },
        {
            title: "Science",
            description: "Explore scientific discoveries and theories.",
            threads: 543,
            posts: 3217
        },
        {
            title: "Arts & Literature",
            description: "Share your favorite books, art, and creative works.",
            threads: 421,
            posts: 2845
        }
    ];

    return (
        <section className={styles.topicsSection}>
            <h2 className={globalStyles.sectionTitle}>Forum Categories</h2>
            <div className={styles.topicGrid}>
                {topics.map((topic, index) => (
                    <div key={index} className={styles.topicCard}>
                        <h3><a href="#">{topic.title}</a></h3>
                        <p>{topic.description}</p>
                        <div className={styles.topicStats}>
                            <div>Threads: {topic.threads.toLocaleString()}</div>
                            <div>Posts: {topic.posts.toLocaleString()}</div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}