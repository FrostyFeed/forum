import React from "react";
import styles from "./NewsForum.module.css";
import formatDate from "../util/dateFormat";
import Modal from "../modal";
import ReplyForm from "../reply_form";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { is } from "date-fns/locale";
import axios from "axios";
import { set } from "date-fns";
const NewsItem = ({ news, onToggleExpand, onEdit, onDelete }) => {
    const { isAdmin } = useAuth();
    const { user } = useAuth();
    const userIsLoggedIn = user !== null && user !== undefined;
    const [userReaction, setUserReaction] = useState(news.userReaction || null);
    const [reaction, setReaction] = useState({
        LIKE: news.likes || 0,
        DISLIKE: news.dislikes || 0,
    });
    const react = async (type) => {
        if (type === userReaction) {
            await axios.delete(`http://localhost:8080/api/news/reaction/${news.id}`, {
                withCredentials: true,
            }).then((response) => {
                if (response.status === 200) {
                    setReaction((prev) => ({
                        ...prev,
                        [type]: prev[type] - 1,
                    }));
                    setUserReaction(null);
                }
            })
        } else {
            await axios.post(`http://localhost:8080/api/news/reaction`, {
                newsId: news.id,
                type: type
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            }).catch((error) => {
                console.error("Error sending reaction:", error);
            }).then((response) => {
                if (response.status === 200) {
                    if (userReaction !== null && userReaction !== type) {
                        setReaction((prev) => ({
                            ...prev,
                            [userReaction]: prev[userReaction] - 1,
                        }));
                    }
                    setReaction((prev) => ({
                        ...prev,
                        [type]: prev[type] + 1,
                    }));
                    setUserReaction(type);
                }
            });

        }
    }
    return (
        <li className={styles.newsItem}>
            <div
                className={styles.newsHeader}
                onClick={() => onToggleExpand(news.id)}
                role="button"
                tabIndex="0"
                onKeyPress={(e) => (e.key === "Enter" || e.key === " ") && onToggleExpand(news.id)}
                aria-expanded={news.isExpanded}
            >
                <div>
                    <h3>{news.title}</h3>
                    <div className={styles.newsMeta}>
                        Створено: {news.creationDate ? formatDate(news.creationDate) : "Немає дати"}
                    </div>
                </div>
                <span>{news.isExpanded ? "▲" : "▼"}</span>
            </div>

            {!news.isExpanded && (
                <div className={styles.newsShortDescription}>
                    {news.description}
                </div>
            )}

            {news.isExpanded && (
                <div className={styles.newsContent}>
                    <p>{news.description}</p>
                    <div dangerouslySetInnerHTML={{ __html: news.content }} />
                </div>
            )}

            <div className={styles.newsReactions}>
                <div className={styles.reactionButtons}>
                    <button
                        className={`${styles.reactionButton} ${styles.likeButton} ${userReaction === 'LIKE' ? styles.active : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            react('LIKE');
                        }}
                        aria-label="Подобається"
                        title="Подобається"
                        disabled={!userIsLoggedIn}
                    >
                        <span className={styles.reactionIcon}>👍</span>
                        <span className={styles.reactionCount}>{reaction.LIKE}</span>
                    </button>

                    <button
                        className={`${styles.reactionButton} ${styles.dislikeButton} ${userReaction === 'DISLIKE' ? styles.active : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            react('DISLIKE');
                        }}
                        aria-label="Не подобається"
                        title="Не подобається"
                        disabled={!userIsLoggedIn}
                    >
                        <span className={styles.reactionIcon}>👎</span>
                        <span className={styles.reactionCount}>{reaction.DISLIKE}</span>
                    </button>
                </div>
            </div>

            {isAdmin && (
                <div className={styles.newsActions}>
                    <button
                        className={`${styles.button} ${styles.secondaryButton}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(news);
                        }}
                    >
                        Редагувати
                    </button>
                    <button
                        className={`${styles.button} ${styles.dangerButton}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(news.id);
                        }}
                    >
                        Видалити
                    </button>
                </div>
            )}
        </li>
    );
};

export default NewsItem;