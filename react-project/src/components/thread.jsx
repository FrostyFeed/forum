import styles from './styles/thread.module.css';
import globalStyles from './styles/global.module.css';
import { Link } from 'react-router-dom';
import ThreadHeader from './thread/header.jsx';
import Post from "./thread/post.jsx";
import { useAuth } from "../context/AuthContext.jsx"
import { useRef, useState, useEffect, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import ReplyForm from './reply_form.jsx'
import { ReplyProvider } from '../context/ReplyContext.jsx';
import PostReference from './postReference.jsx';
import Navigation from './navigation.jsx'
import ScrollToTopButton from './ScrollToTopButton.jsx';
import { ThreadProvider, useThread } from '../context/ThreadContext.jsx';
import { PostsProvider } from '../context/PostsContext.jsx';
import { usePosts } from '../context/PostsContext.jsx';
import GoBackButton from './backBtn/GoBackButton.jsx';
import { useNavigate } from 'react-router-dom';
export default function Thread({ thread, replies: initialReplies }) {
    const { user } = useAuth();
    const navigate = useNavigate();

    const { content, setContent } = useThread();
    const initialRepliesData = initialReplies || { content: [], pageNumber: -1, hasNext: true };

    const [repliesList, setRepliesList] = useState(initialRepliesData);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialRepliesData.hasNext ?? true);

    const pageRef = useRef((initialRepliesData.pageNumber ?? -1) + 1);
    const loaderDivRef = useRef(null);

    const addReply = (newPost) => {
        setRepliesList(prevRepliesList => ({
            ...prevRepliesList, // Spread the previous repliesList object to preserve other metadata
            content: [newPost, ...prevRepliesList.content] // Add newPost to the beginning of the content array
        }));
        setContent(prevContent => ({
            ...prevContent,
            repliesCount: (prevContent.repliesCount || 0) + 1,
            lastReplyDate: newPost.creationDate // Update the last reply date to the new post's creation date 
        }));
    }
    const loadReplies = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const pageToFetch = pageRef.current;
            const response = await axios.get(`http://localhost:8080/api/replies/${thread.id}?page=${pageToFetch}`);

            setRepliesList(prev => ({
                ...response.data,
                content: [...(prev?.content || []), ...response.data.content],
            }));

            setHasMore(response.data.hasNext);
            if (response.data.hasNext) {
                pageRef.current = response.data.pageNumber + 1;
            } else {
                pageRef.current = response.data.pageNumber;
            }
        } catch (error) {
            console.error("Failed to load replies:", error);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    }, [thread?.id, hasMore, loading]);
    useEffect(() => {
        setContent(thread);
    }, [thread, setContent]);
    useEffect(() => {
        const effectiveInitialReplies = initialReplies || { content: [], pageNumber: -1, hasNext: true };
        setRepliesList(effectiveInitialReplies);
        pageRef.current = (effectiveInitialReplies.pageNumber ?? -1) + 1;
        setHasMore(effectiveInitialReplies.hasNext ?? true);
    }, [initialReplies, thread?.id]); // Reset if initial data or thread changes

    useEffect(() => {
        const currentLoaderRef = loaderDivRef.current;
        if (!currentLoaderRef) return;

        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    loadReplies();
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
    }, [hasMore, loading, loadReplies]);


    const deleteReply = (id, isMainPost) => {
        if (isMainPost) {
            navigate(`/topic/${id}`);
            console.log(thread)
        } else {
            setRepliesList(prev => ({
                ...prev,
                content: prev.content.filter(post => post.id !== id),
            }));
        }
    }
    // Prepare thread data for the Post component if needed in that format
    const threadPostData = thread ? [{
        content: thread.content,
        userName: thread.userName,
        isEdited: thread.isEdited,
        isAdmin: thread.isAdmin,
        creationDate: thread.creationDate,
        id: thread.id,
        userId: thread.userId,
        avatarUrl: thread.avatarUrl
    }] : [];

    return (
        <main className={`container ${globalStyles.mainContent}`}>
            <GoBackButton />
            {thread && <ThreadHeader thread={thread} />}
            {threadPostData.length > 0 && <Post post={threadPostData} isMainPost={true} deleteReply={deleteReply} />}

            {user && thread && (
                <ReplyForm
                    threadId={thread.id}
                    addReply={addReply}
                />
            )}

            <Post post={repliesList?.content || []} deleteReply={deleteReply} />
            <ScrollToTopButton />
            {loading && <div style={{ textAlign: 'center', padding: '20px' }}>Завантажуються більше відповідей...</div>}
            {!loading && hasMore && <div ref={loaderDivRef} style={{ height: '50px', margin: '20px 0' }} aria-hidden="true" />}
            {!loading && !hasMore && (repliesList?.content?.length ?? 0) > 0 && <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>Кінець відповідей.</div>}

        </main>
    );
}