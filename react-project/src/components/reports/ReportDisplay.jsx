import { useState, useEffect, useCallback } from "react";
import { z } from "zod";
import axios from "axios";
import styles from "./reportDisplay.module.css";
import globalStyles from '../styles/global.module.css';
import PostDisplay from "./PostDisplay";
import { useAuth } from "../../context/AuthContext.jsx";
import formatDate from "../util/dateFormat";
import GlobalErrorDisplay from "../error/GlobalErrorDisplay.jsx";
import { set } from "date-fns";
import { Link } from "react-router-dom";

const ReportedPostPlaceholder = ({ postData }) => {
    if (!postData) return <p>Дані допису не надано.</p>;
    return (
        <div className={styles.reportedPostContent}>
            <h4>Вміст повідомленого допису (ID: {postData?.id || 'Н/Д'})</h4>
            <p><em>"{postData?.contentSnippet || 'Без фрагмента'}"</em></p>
        </div>
    );
};

const banSchema = z.object({
    banReason: z.string().min(5, "Причина бану повинна містити щонайменше 5 символів."),
    banDuration: z.coerce
        .number({ invalid_type_error: "Тривалість повинна бути числом." })
        .int("Тривалість повинна бути цілим числом днів.")
        .positive("Тривалість повинна бути позитивним числом днів.")
        .min(1, "Мінімальна тривалість бану – 1 день."),
});
const API_URL_BAN_USER = "http://localhost:8080/api/bans";
const API_URL_DISMISS_REPORT = "http://localhost:8080/api/reports/dismiss";

export default function ReportDisplay({
    reportData,
    isLoading,
    ReportedPostComponent = ReportedPostPlaceholder,
    onReportActioned,
    onProcessingEnd,
    onReportReviewed,
    totalReports,
    lastPage,
    hasNextPage,
    hasPrevious,
    loadNextReport,
    loadPreviousReport,

}) {
    const [banReason, setBanReason] = useState("");
    const [banDuration, setBanDuration] = useState("");
    const { user } = useAuth();
    const [isProcessingAction, setIsProcessingAction] = useState(false);
    const [message, setMessage] = useState(null);
    const [deletePostContent, setDeletePostContent] = useState(false);
    console.log(hasNextPage)

    useEffect(() => {
        if (reportData) {
            setBanReason("");
            setBanDuration("");
            setMessage(null);
            setDeletePostContent(false);
        }
        if (!reportData) {
            setBanReason("");
            setBanDuration("");
            setMessage(null);
            setDeletePostContent(false);
        }
    }, [reportData?.id]);

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        if (message) setMessage(null);
    };

    const processReportAction = async (actionType, payload) => {
        if (!reportData || isProcessingAction) return;

        if (actionType === "ban" && (!reportData.userId || typeof reportData.userId === 'undefined')) {
            setMessage("Не вдалося забанити користувача: ID користувача, на якого надійшла скарга, відсутній у даних звіту.");
            return;
        }

        setMessage(null);
        setIsProcessingAction(true);

        try {
            let responseMessage = "";
            const reportIdToProcess = reportData.id;
            const reportedUserId = reportData.userId;

            if (actionType === "ban") {
                if (typeof reportedUserId === 'undefined') {
                    throw new Error("Reported user ID is missing, cannot proceed with ban.");
                }
                const validationResult = banSchema.safeParse({
                    banReason: payload.reason,
                    banDuration: payload.duration,
                });

                if (!validationResult.success) {
                    setMessage(validationResult.error.errors[0].message);
                    setIsProcessingAction(false);
                    if (onProcessingEnd) onProcessingEnd(false, validationResult.error.errors[0].message);
                    return;
                }
                await axios.post(API_URL_BAN_USER, {
                    reportId: reportData.id,
                    bannedUserId: reportData.userId,
                    adminId: user.id,
                    reason: validationResult.data.banReason,
                    duration: validationResult.data.banDuration,
                    deletePostContent: deletePostContent
                }, { withCredentials: true });
                responseMessage = "Користувача успішно забанено.";
            } else if (actionType === "dismiss") {
                await axios.post(`${API_URL_DISMISS_REPORT}?reportId=${reportData.id}`, {
                }, { withCredentials: true });
                responseMessage = "Скаргу успішно відхилено.";
            }

            setMessage(responseMessage + " Сповіщаю систему...");

            onReportReviewed()
            if (onProcessingEnd) onProcessingEnd(true, responseMessage);


        } catch (err) {
            console.error("Report action error:", err);
            let errorMessage = "Виникла неочікувана помилка. Будь ласка, спробуйте ще раз.";
            if (err instanceof z.ZodError) {
                errorMessage = err.errors[0].message;
            } else if (err.response) {
                errorMessage = err.response.data || "Під час дії виникла помилка API.";
            } else if (err.message) {
                errorMessage = err.message;
            }
            setMessage(errorMessage);
            if (onProcessingEnd) onProcessingEnd(false, errorMessage);
        } finally {
            setIsProcessingAction(false);
        }
    };

    const handleBanUser = () => {
        processReportAction("ban", { reason: banReason, duration: parseInt(banDuration, 10) });
    };

    const handleDismissReport = () => {
        processReportAction("dismiss", {});
    };

    console.log(reportData)

    if (isLoading) {
        return (
            <main className={`${globalStyles.container} ${globalStyles.mainContent}`}>
                <div className={styles.reportDisplayContainer}>
                    <p className={styles.loadingMessage}>Завантаження даних скарги....</p>
                </div>
            </main>
        );
    }

    if (!reportData) {
        return (
            <main className={`${globalStyles.container} ${globalStyles.mainContent}`}>
                <div className={styles.reportDisplayContainer}>
                    <p className={styles.noReportsMessage}>Немає доступних скарг.</p>
                </div>
            </main>
        );
    }

    return (
        <main className={`${globalStyles.container} ${globalStyles.mainContent}`}>
            <div className={styles.reportDisplayContainer}>
                {totalReports > 0 && (
                    <div className={styles.navigationControls}>
                        <button
                            onClick={loadPreviousReport}
                            disabled={!hasPrevious || isProcessingAction || isLoading}
                            className={styles.navButton}
                        >
                            « Попередній
                        </button>
                        <button
                            onClick={loadNextReport}
                            disabled={!hasNextPage || isProcessingAction || isLoading}
                            className={styles.navButton}
                        >
                            Наступний »
                        </button>
                    </div>
                )}

                {isProcessingAction && <p className={styles.loadingMessage}>Обробка дії...</p>}

                <section className={styles.reportDetailsSection}>
                    <h2 className={`${globalStyles.sectionTitle} ${styles.sectionTitleGrow}`}>Деталі скарги (ID: {reportData.id})</h2>

                    {reportData && (
                        <div className={styles.reportedUserInfo}>
                            <img
                                src={reportData.avatarUrl || 'https://via.placeholder.com/80?text=Немає+Аватара'}
                                alt={`${reportData.nickname || 'Користувач'}'s аватар`}
                                className={styles.userAvatar}
                            />
                            <div className={styles.userInfoText}>
                                <Link to={`/user/${reportData.userId}`}>
                                    <h3>
                                        Користувач: {reportData.nickname || 'Н/Д'}
                                        {reportData.userId && ` (ID: ${reportData.userId})`}
                                    </h3></Link>
                                {reportData.userRegistrationDate && (
                                    <p>Зареєстрований: {new Date(reportData.userRegistrationDate).toLocaleDateString()}</p>
                                )}
                            </div>
                        </div>
                    )}

                    <div className={styles.reportMeta}>
                        {reportData.reportCreationDate && (
                            <p><strong>Повідомлено:</strong> {formatDate(reportData.reportCreationDate)}</p>
                        )}
                        {reportData.reason && (
                            <p><strong>Причина скарги:</strong> {reportData.reason}</p>
                        )}
                        {reportData.threadTittle && (
                            <Link to={`/thread/${reportData.threadId}`}><p><strong>Тема: </strong> {reportData.threadTittle}</p></Link>
                        )}
                    </div>

                    {reportData ? (
                        <div className={styles.reportedPostArea}>
                            <h3>Образливий вміст:</h3>
                            <PostDisplay postData={{
                                id: reportData.id,
                                postContent: reportData.postContent,
                                postCreationDate: reportData.postCreationDate
                            }} />
                        </div>
                    ) : (
                        <div className={styles.reportedPostArea}>
                            <h3>Образливий вміст:</h3>
                            <p>Деталі щодо повідомленого вмісту недоступні.</p>
                        </div>
                    )}
                </section>

                <section className={styles.adminActionsSection}>
                    <h2 className={`${globalStyles.sectionTitle} ${styles.sectionTitleGrow}`}>Дії адміністратора</h2>
                    <div className={styles.actionForm}>
                        <div className={`${styles.inputGroup} ${styles.checkboxGroup}`}>
                            <input
                                type="checkbox"
                                id="deletePostContentCheckbox"
                                checked={deletePostContent}
                                onChange={(e) => setDeletePostContent(e.target.checked)}
                                className={styles.formCheckbox}
                                disabled={isProcessingAction || !reportData || !reportData.postContent}
                            />
                            <label htmlFor="deletePostContentCheckbox" className={styles.checkboxLabel}>
                                Видалити вміст допису
                            </label>
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="banReason" className={styles.inputLabel}>Причина бану:</label>
                            <textarea
                                id="banReason"
                                value={banReason}
                                onChange={handleInputChange(setBanReason)}
                                placeholder="Введіть причину бану користувача..."
                                className={styles.formTextarea}
                                rows="3"
                                disabled={isProcessingAction || !reportData}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="banDuration" className={styles.inputLabel}>Тривалість бану (днів):</label>
                            <input
                                type="number"
                                id="banDuration"
                                value={banDuration}
                                onChange={handleInputChange(setBanDuration)}
                                placeholder="наприклад, 7"
                                className={styles.formInput}
                                min="1"
                                disabled={isProcessingAction || !reportData}
                            />
                        </div>
                        <div className={styles.actionButtonsContainer}>
                            <button
                                onClick={handleBanUser}
                                className={`${styles.actionButton} ${styles.banButton}`}
                                disabled={
                                    isProcessingAction ||
                                    !banReason ||
                                    !banDuration ||
                                    !reportData.userId ||
                                    typeof reportData.userId === 'undefined'
                                }
                            >
                                {isProcessingAction ? "Банимо..." : "Забанити користувача"}
                            </button>
                            <button
                                onClick={handleDismissReport}
                                className={`${styles.actionButton} ${styles.dismissButton}`}
                                disabled={isProcessingAction}
                            >
                                {isProcessingAction ? "Відхиляємо..." : "Відхилити скаргу"}
                            </button>
                        </div>
                    </div>
                </section>
            </div>
            <GlobalErrorDisplay message={message} onClose={() => setMessage(null)} />
        </main>
    );
}