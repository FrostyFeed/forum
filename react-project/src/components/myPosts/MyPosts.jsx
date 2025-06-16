import { useLoaderData } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"
import ThreadList from "../threadList";
import globalStyles from '../styles/global.module.css';
import axios from "axios";
import styles from './MyPosts.module.css';
import { useState } from "react";
import { set } from "date-fns";
export default function MyPosts() {
    const { user } = useAuth();
    const { threads: initialThreads } = useLoaderData();
    const [threads, setThreads] = useState(initialThreads);
    let hasMoreThreads = threads.hasNext;
    const [loading, setLoading] = useState(false);
    const handleLoadMore = async () => {
        if (loading || !hasMoreThreads) return;
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/api/thread?userId=${user.id}&sort=creationDate,desc&page=${threads.pageNumber + 1}`);
            setThreads(prevThreads => ({
                ...response.data,
                content: [...prevThreads.content, ...response.data.content],
            }));
            hasMoreThreads = response.data.hasNext;
        } catch (error) {
            console.error("Failed to load more threads:", error);
        } finally {
            setLoading(false);
        }
    }
    return (
        <main className={`${globalStyles.container} ${globalStyles.mainContent}`}>
            <ThreadList threads={threads} />
            {hasMoreThreads && (
                <div className={styles.loadMoreContainer}>
                    <button
                        className={styles.loadMoreBtn}
                        onClick={handleLoadMore}
                        disabled={loading}
                    >
                        {loading ? 'Завантаження...' : 'Завантажити ще'}
                    </button>
                </div>
            )}

            {!hasMoreThreads && threads.length > 10 && (
                <div className={styles.endMessage}>
                    Усі теми завантажено
                </div>
            )}
        </main >

    )
}
export async function MyPostsLoader({ params }) {
    const userId = params.userId;
    const threads = await axios.get(`http://localhost:8080/api/thread?userId=${userId}&sort=creationDate,desc`)
    return {
        threads: threads.data
    }

}