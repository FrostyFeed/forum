import styles from '../styles/thread.module.css'
import clsx from 'clsx';
import { Link } from 'react-router-dom'
import formatDate from '../util/dateFormat';
import { useAuth } from "../../context/AuthContext.jsx"
import DOMPurify from 'dompurify';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../modal.jsx';
import PostForm from '../reply_form.jsx';
import { useThread } from '../../context/ThreadContext.jsx';
import ReportForm from '../reports/ReportForm.jsx';
import DeleteConfirmation from '../DeleteConfirmation.jsx';
import adminStyles from '../styles/adminAnimation.module.css';
import { is } from 'date-fns/locale';
export default function Reply({ post: initialPost, isMainPost, deleteReply }) {
    const { user } = useAuth()
    const { setContent, content } = useThread();
    const [post, setPost] = useState(initialPost)
    const [upvotes, setUpvote] = useState(post.upvoteCount)
    const [userHasUpvoted, setUserHasUpvoted] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const [isDelteteModalOpen, setIsDeleteModalOpen] = useState(false);
    const openDeleteModal = () => setIsDeleteModalOpen(true);
    const closeDeleteModal = () => setIsDeleteModalOpen(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const openReportModal = () => setIsReportModalOpen(true);
    const closeReportModal = () => setIsReportModalOpen(false);
    const isFromUser = Number(user.id) === post.userId;
    console.log(post.isAdmin)

    useEffect(() => {
        if (user && user.upvotedReplies) {
            setUserHasUpvoted(user.upvotedReplies.includes(post.id));
        }
    }, [user, post.id]);
    const handleUpvote = async (id) => {
        await axios.post(
            `http://localhost:8080/api/reply/${id}/upvote`,
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            }
        ).then((response) => {
            if (user.upvotedReplies.includes(id)) {
                setUserHasUpvoted(false);
                setUpvote((prevUpvotes) => prevUpvotes - 1);
                user.upvotedReplies = user.upvotedReplies.filter((replyId) => replyId !== id);
            } else {
                setUserHasUpvoted(true);
                setUpvote((prevUpvotes) => prevUpvotes + 1);
                user.upvotedReplies.push(id);
            }
        }).catch((error) => {
            console.log(error);
        });


    }
    const handleThreadSuccess = (newPost) => {

        if (isMainPost) {
            setContent(oldPost => ({
                ...oldPost,
                title: newPost.title,
                content: newPost.content,
                creationDate: newPost.creationDate,
                isEdited: true
            }))
        }
        setPost(oldPost => ({
            ...oldPost,
            content: newPost.content,
            title: newPost.title,
            creationDate: newPost.creationDate,
            isEdited: true
        }))
        closeModal();
    }
    const handleRedact = () => {
        openModal()
    };

    const handleReport = (postId) => {
        openReportModal()
    }
    const handleDelete = (postId) => {
        openDeleteModal()
    };
    const handleDeleteSuccess = (postId, isMainPost) => {
        deleteReply(postId, isMainPost)
        closeDeleteModal();
    }
    const getUpvoteClass = (count) => {
        if (count >= 1000) return 'legendary';
        if (count >= 500) return 'epic';
        if (count >= 100) return 'hot';
        if (count >= 50) return 'popular';
        if (count >= 10) return 'rising';
        return 'normal';
    };
    return (
        <>
            <div className={styles.postHeader}>
                <div className={styles.postAuthor}>
                    <div className={styles.avatar}>
                        {post.userId !== 24 ? (
                            <Link to={`/user/${post.userId}`} className={styles.link}>
                                <img src={post.avatarUrl} alt={`${post.userName}'s avatar`} />
                            </Link>
                        ) : (
                            <img src={post.avatarUrl} alt={`${post.userName}'s avatar`} />
                        )}
                    </div>
                    <div className={styles.authorInfo}>
                        <div
                            className={clsx(
                                styles.authorName,
                                {
                                    [adminStyles.adminLook]: post.isAdmin,
                                    [adminStyles.adminAnimation]: post.isAdmin,
                                }
                            )}
                        >
                            {post.userName}
                        </div>
                        <div className={styles.postMeta}>Опубліковано {formatDate(post.creationDate)} {post.isEdited && "| Відредаговано"}</div>
                    </div>
                </div>
                {user && (
                    <div className={styles.postActions}>
                        {(!isMainPost && !isFromUser) && (
                            <button
                                className={clsx(
                                    styles.actionBtn,
                                    styles.upvoteBtn,
                                    styles[getUpvoteClass(upvotes)],
                                    {
                                        [styles.upvoted]: userHasUpvoted,
                                        [styles.pulsing]: upvotes > 0 && upvotes % 10 === 0,
                                        [styles.glowing]: upvotes >= 100,
                                        [styles.rainbow]: upvotes >= 1000,
                                    }
                                )}
                                onClick={() => handleUpvote(post.id)}
                            >
                                <span className={clsx(styles.plusSymbol, {
                                    [styles.spinning]: upvotes >= 500,
                                })}>
                                    {upvotes >= 1000 ? '🔥' : '+'}
                                </span>
                                <span className={styles.upvoteCount}>{upvotes}</span>

                                {upvotes >= 100 && (
                                    <div className={styles.particles}>
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className={styles.particle} />
                                        ))}
                                    </div>
                                )}
                            </button>
                        )}
                        {!isFromUser && (
                            <button className={styles.actionBtn} onClick={handleReport}>Поскаржитись</button>
                        )}
                        {Number(user.id) === Number(post.userId) && (
                            <>
                                <button
                                    className={`${styles.actionBtn} ${styles.iconBtn} ${styles.redactBtn}`}
                                    onClick={() => handleRedact(post.id)}
                                    aria-label="Redact post"
                                    title="Redact post"
                                >
                                    Редагувати
                                </button>

                                <button
                                    className={`${styles.actionBtn} ${styles.iconBtn} ${styles.deleteBtn}`}
                                    onClick={() => handleDelete(post.id)}
                                    aria-label="Delete post"
                                    title="Delete post"
                                >
                                    Видалити
                                </button>


                            </>
                        )}
                    </div>
                )}
            </div>
            <div className={styles.postContent} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}></div>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <PostForm
                    formType={isMainPost ? "thread" : "reply"}
                    redactedPost={post}
                    isThread={isMainPost}
                    onSuccess={handleThreadSuccess}
                    onCancel={closeModal}
                />
            </Modal>
            <Modal isOpen={isDelteteModalOpen} onClose={closeDeleteModal}>
                <DeleteConfirmation onCancel={closeDeleteModal} postId={post.id} onConfirm={handleDeleteSuccess} isMainPost={isMainPost}
                />
            </Modal>
            <Modal isOpen={isReportModalOpen} onClose={closeReportModal}>
                <ReportForm isMainPost={isMainPost} id={post.id} onClose={closeReportModal} />
            </Modal>

        </>
    )
}