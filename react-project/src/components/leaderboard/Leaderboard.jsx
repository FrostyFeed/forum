import React, { useState, useEffect, useCallback } from 'react';
import DOMPurify from 'dompurify';
import styles from './Leaderboard.module.css';
import { addYears } from 'date-fns';
import axios, { all } from 'axios';
import { useLoaderData } from 'react-router-dom';






function Leaderboard() {
    const loaderData = useLoaderData();

    const [allTimeTopUsers] = useState(loaderData?.allTimeTopUsers || []);
    const [monthlyTopUsers] = useState(loaderData?.monthlyTopUsers || []);

    const [selectedUserContext, setSelectedUserContext] = useState(null);
    const [selectedUserRepliesDetails, setSelectedUserRepliesDetails] = useState([]);

    const [isLoadingReplies, setIsLoadingReplies] = useState(false);
    const [repliesError, setRepliesError] = useState(null);

    const handleUserClick = useCallback(async (user, listType) => {
        if (selectedUserContext && selectedUserContext.user.id === user.id && selectedUserContext.listType === listType) {
            setSelectedUserContext(null);
            setSelectedUserRepliesDetails([]);
            setRepliesError(null);
            return;
        }

        setSelectedUserContext({ user, listType });
        setSelectedUserRepliesDetails([]);
        setIsLoadingReplies(true);
        setRepliesError(null);

        try {
            console.log(selectedUserContext)
            const periodParam = listType === 'allTime' ? 'alltime' : 'month';
            const response = await axios.get(`http://localhost:8080/api/reply/best/${user.id}?period=${periodParam}`, {
                withCredentials: true
            });

            let topReplies = response.data || [];
            setSelectedUserRepliesDetails(topReplies);

        } catch (err) {
            console.error(`Failed to fetch ${listType} user replies:`, err);
            setRepliesError(`Не вдалося завантажити найкращі відповіді користувача за ${listType === 'allTime' ? 'весь час' : 'місяць'}. Будь ласка, спробуйте ще раз.`);
        } finally {
            setIsLoadingReplies(false);
        }
    }, [selectedUserContext]);

    const renderUserList = (users, listType) => {
        if (!users || users.length === 0) {
            return <p className={styles.noData}>Немає користувачів для відображення в цій категорії.</p>;
        }

        return (
            <ul className={styles.userList}>
                {users.map((user, index) => (
                    <li
                        key={`${listType}-${user.id}`}
                        className={`${styles.userItem} ${selectedUserContext?.user.id === user.id ? styles.selected : ''}`}
                        onClick={() => handleUserClick(user, listType)}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => e.key === 'Enter' && handleUserClick(user, listType)}
                        aria-current={selectedUserContext?.user.id === user.id ? "true" : "false"}
                    >
                        <span className={styles.rank}>#{index + 1}</span>
                        <img
                            src={user.avatarUrl || `https://via.placeholder.com/40/808080/FFFFFF?Text=${user.username ? user.username.charAt(0).toUpperCase() : 'U'}`}
                            alt={`${user.username || 'Користувач'}'s аватар`}
                            className={styles.avatar}
                        />
                        <span className={styles.username}>{user.username || 'Невідомий користувач'}</span>
                        <span className={styles.reputation}>
                            {user.reputation}
                        </span>
                    </li>
                ))}
            </ul>
        );
    };

    const getReplySectionTitle = () => {
        if (!selectedUserContext) return "";
        const periodText = selectedUserContext.listType === 'allTime' ? 'За весь час' : 'Цього місяця';
        return `Найкращі відповіді ${periodText} від ${selectedUserContext.user.username}`;
    };

    return (
        <div className={styles.leaderboardContainer}>
            {repliesError && !isLoadingReplies && <p className={styles.error}>{repliesError}</p>}

            <div className={styles.sectionsWrapper}>
                <section className={styles.leaderboardSection}>
                    <h2 className={styles.sectionTitle}>Найкращі користувачі (за весь час)</h2>
                    {renderUserList(allTimeTopUsers, 'allTime')}
                </section>

                <section className={styles.leaderboardSection}>
                    <h2 className={styles.sectionTitle}>Найкращі користувачі (цього місяця)</h2>
                    {renderUserList(monthlyTopUsers, 'monthly')}
                </section>
            </div>

            {selectedUserContext && (
                <section className={styles.selectedUserDetails}>
                    <button
                        className={styles.closeButton}
                        onClick={() => { setSelectedUserContext(null); setSelectedUserRepliesDetails([]); setRepliesError(null); }}
                        aria-label="Закрити деталі користувача"
                    >
                        ×
                    </button>
                    <h3 className={styles.selectedUserName}>
                        {getReplySectionTitle()}
                    </h3>
                    {isLoadingReplies ? (
                        <p className={styles.loading}>Завантаження відповідей...</p>
                    ) : selectedUserRepliesDetails.length > 0 ? (
                        <ul className={styles.repliesList}>
                            {selectedUserRepliesDetails.map(replyDetail => (
                                <li key={replyDetail.id} className={styles.replyItem}>
                                    <p className={styles.replyContent} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(replyDetail.content) }}></p>
                                    <p className={styles.replyUpvotes}>{replyDetail.upvotes} Вподобань</p>
                                    <div className={styles.threadInfo}>
                                        <p className={styles.threadTitle}>
                                            <span className={styles.threadTitlePrefix}>У темі: </span>
                                            {replyDetail.threadTitle || "Н/Д"}
                                        </p>
                                        <p className={styles.threadContentSnippet} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(replyDetail.threadContent) }}>
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        !repliesError && <p className={styles.noData}>Не знайдено відповідей з великою кількістю вподобань для цього користувача за цей період.</p>
                    )}
                </section>
            )}
        </div>
    );
}

export default Leaderboard;
export async function leaderboardLoader() {
    const response = await axios.get('http://localhost:8080/api/leaderboards/monthly');
    const responseAllTime = await axios.get('http://localhost:8080/api/leaderboards/ever');
    return {
        monthlyTopUsers: response.data,
        allTimeTopUsers: responseAllTime.data
    };
}