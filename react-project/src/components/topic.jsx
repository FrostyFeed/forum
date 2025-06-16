import styles from './styles/topic.module.css'
import { useLoaderData, useNavigate, useParams } from 'react-router-dom'
import globalStyles from './styles/global.module.css'
import axios from 'axios'
import ThreadList from './threadList.jsx'
import PostForm from './reply_form.jsx'
import Modal from './modal.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { use, useEffect, useRef, useState, useCallback } from 'react'
import Navigation from './navigation.jsx'
import Filters from './filters.jsx'
import ScrollToTopButton from './ScrollToTopButton.jsx'
import GoBackButton from './backBtn/GoBackButton.jsx'
export default function Topic() {
    const navigate = useNavigate();
    const { topic: initialTopic, threadDAOList: initialThreadDAOList } = useLoaderData();
    const { user } = useAuth();
    const { id: topicIdFromParams } = useParams();

    const [topicData, setTopicData] = useState(initialTopic);
    const [threadList, setThreadList] = useState(initialThreadDAOList || { content: [], pageNumber: -1, hasNext: true });
    const [sortBy, setSortBy] = useState('creationDate,desc');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialThreadDAOList?.hasNext ?? true);
    const [isFetchingAfterSortChange, setIsFetchingAfterSortChange] = useState(false);


    const pageRef = useRef((initialThreadDAOList?.pageNumber ?? -1) + 1);
    const loaderDivRef = useRef(null);
    const previousSortByRef = useRef(sortBy);
    const isInitialMountSortEffectRef = useRef(true);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const loadThreads = useCallback(async (isNewSort = false) => {
        if (loading && !isNewSort) return;
        if (!hasMore && !isNewSort) return;

        setLoading(true);
        try {
            const pageToFetch = isNewSort ? 0 : pageRef.current;
            const response = await axios.get(`http://localhost:8080/api/thread?topicId=${topicData.id}&page=${pageToFetch}&sort=${sortBy}`);

            setThreadList(prev => ({
                ...response.data,
                content: isNewSort ? response.data.content : [...(prev?.content || []), ...response.data.content],
            }));

            setHasMore(response.data.hasNext);
            if (response.data.hasNext) {
                pageRef.current = response.data.pageNumber + 1;
            } else {
                pageRef.current = response.data.pageNumber;
            }
        } catch (error) {
            console.error("Failed to load threads:", error);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    }, [topicData?.id, sortBy, hasMore, loading]);


    useEffect(() => {
        setTopicData(initialTopic);
        const effectiveInitialThreads = initialThreadDAOList || { content: [], pageNumber: -1, hasNext: true };
        setThreadList(effectiveInitialThreads);
        pageRef.current = (effectiveInitialThreads.pageNumber ?? -1) + 1;
        setHasMore(effectiveInitialThreads.hasNext ?? true);

        previousSortByRef.current = sortBy;
        isInitialMountSortEffectRef.current = true;
    }, [initialTopic, initialThreadDAOList]);


    useEffect(() => {
        if (isInitialMountSortEffectRef.current) {
            isInitialMountSortEffectRef.current = false;
            previousSortByRef.current = sortBy;
            return;
        }

        if (previousSortByRef.current === sortBy) {
            return;
        }

        previousSortByRef.current = sortBy;

        pageRef.current = 0;
        setHasMore(true);
        setThreadList({ content: [], pageNumber: -1, hasNext: true });
        setIsFetchingAfterSortChange(true);

    }, [sortBy]);

    useEffect(() => {
        if (isFetchingAfterSortChange) {
            setIsFetchingAfterSortChange(false);
            loadThreads(true);
        }
    }, [isFetchingAfterSortChange, loadThreads]);


    useEffect(() => {
        const currentLoaderRef = loaderDivRef.current;
        if (!currentLoaderRef || isFetchingAfterSortChange) return;

        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    loadThreads(false);
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(currentLoaderRef);
        return () => {
            if (currentLoaderRef) {
                observer.unobserve(currentLoaderRef);
            }
        };
    }, [hasMore, loading, loadThreads, isFetchingAfterSortChange]);
    // Handler for successful thread creation
    const handleThreadSuccess = (newThreadData) => {
        closeModal(); // Close the modal
        navigate(`/topic/${initialTopic.id}`, { replace: true });


        setThreadList(prevData => ({
            ...prevData,
            content: [newThreadData, ...(prevData.content || [])]
        }));
    };
    return (
        <main className={`${globalStyles.container} ${globalStyles.mainContent}`}>
            <div>
                <div className={styles.topicHeader}>
                    <div className={styles.topicTitle}>
                        <div className={styles.topicIcon}>T</div>
                        <div>{topicData.tittle}</div>
                    </div>
                    {user && (
                        <button onClick={openModal} className={styles.createThreadBtn}>
                            Створити пост
                        </button>
                    )}
                    {!user && (
                        <p className={styles.loginPrompt}>Авторизуйтеся, щоб створити пост.</p> // Prompt to log in
                    )}
                </div>


                <ScrollToTopButton />
                <Filters setFilter={setSortBy} sortBy={sortBy} />
                <ThreadList threads={threadList || []} />
                {hasMore && !loading && <div ref={loaderDivRef} style={{ height: '50px', margin: '20px 0' }} />}

            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <PostForm
                    formType="thread"
                    isThread={true}
                    parentId={topicData.id}
                    onSuccess={handleThreadSuccess}
                    onCancel={closeModal}
                />
            </Modal>
        </main>
    );
}

export async function TopicPageLoader({ params }) {
    const { id } = params;
    try {
        const response = await axios.get(`http://localhost:8080/api/topic/${id}`);
        const threads = await axios.get(`http://localhost:8080/api/thread?topicId=${id}&sort=creationDate,desc`,)
        return {
            topic: response.data,
            threadDAOList: threads.data
        }
    } catch (error) {
        console.error("Failed to load topic data:", error);
        throw new Response("Not Found", { status: 404 });
    }
}