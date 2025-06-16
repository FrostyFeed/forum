import { useState, useEffect, useRef } from 'react';
import styles from './GlobalErrorDisplay.module.css';

const DISMISS_TIMEOUT = 5000;

export default function GlobalErrorDisplay({ message, onClose }) {
    const [isVisible, setIsVisible] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        if (message) {
            setIsVisible(true);

            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }

            timerRef.current = setTimeout(() => {
                setIsVisible(false);
                if (onClose) {
                    onClose();
                }
            }, DISMISS_TIMEOUT);
        } else {
            setIsVisible(false);
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [message, onClose]);

    const handleManualClose = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        setIsVisible(false);
        if (onClose) {
            onClose();
        }
    };

    if (!message && !isVisible) {
        return null;
    }

    return (
        <div
            className={`${styles.errorContainer} ${isVisible ? styles.errorContainerVisible : ''}`}
            role="alert"
            aria-live="assertive"
        >
            <p className={styles.errorMessage}>{message}</p>
            <button
                onClick={handleManualClose}
                className={styles.closeButton}
                aria-label="Close error message"
            >
                ×
            </button>
        </div>
    );
}