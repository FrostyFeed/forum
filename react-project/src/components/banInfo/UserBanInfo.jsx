import React from 'react';
import styles from './UserBanInfo.module.css'; // Import the CSS module
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx'; // Import the Auth context

function UserBanInfo({
}) {
    const { banDetails, showBanInfo, setShowBanInfo } = useAuth();
    const isBanned = banDetails !== null; // Check if the user is banned
    const show = showBanInfo
    const onAcknowledge = () => {
        setShowBanInfo(false); // Close the ban info when acknowledged
    }
    const reason = banDetails?.reason
    const bannedUntil = banDetails?.duration
    const appealContact = "vlad.negerey1@gmail.com"
    if (!show) {
        return null
    }
    // Effect for handling the Escape key
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                if (onAcknowledge) {
                    onAcknowledge();
                }
            }
        };

        if (isBanned) {
            document.addEventListener('keydown', handleKeyDown);
        }

        // Cleanup function to remove the event listener
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isBanned, onAcknowledge]); // Dependencies for the effect

    if (!isBanned) {
        return null;
    }

    // Handler for clicking on the overlay
    const handleOverlayClick = (event) => {
        // Check if the click was directly on the overlay and not its children
        if (event.target === event.currentTarget) {
            if (onAcknowledge) {
                onAcknowledge();
            }
        }
    };

    return (
        <div
            className={styles.overlay}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="banHeader"
            onClick={handleOverlayClick} // Обробка кліку по оверлею
        >
            <div className={styles.banInfoCard}>
                {/* Кнопка закриття "X" */}

                <h2 id="banHeader" className={styles.banHeader}>
                    Доступ до облікового запису обмежено
                </h2>

                <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Причина:</span>
                    <p className={styles.infoValue}>{reason || 'Причина не вказана.'}</p>
                </div>

                <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Обмеження закінчується:</span>
                    <p className={styles.infoValue}>{bannedUntil || 'Постійно'}</p>
                </div>

                {appealContact && (
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Для оскарження:</span>
                        <p className={styles.infoValue}>
                            Будь ласка, зв'яжіться з{' '}
                            <a href={`mailto:${appealContact}`} className={styles.appealLink}>
                                {appealContact}
                            </a>
                        </p>
                    </div>
                )}

                {/* Оригінальна кнопка "Ознайомлений" може залишитися або бути видалена, якщо "X" достатньо */}
                {onAcknowledge && (
                    <button
                        type="button"
                        className={styles.acknowledgeButton}
                        onClick={onAcknowledge}
                        aria-label="Ознайомлений та закрити інформацію про блокування"
                    >
                        Ознайомлений
                    </button>
                )}
            </div>
        </div>
    );
}


export default UserBanInfo;