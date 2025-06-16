import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./styles/settings.module.css";
export default function PasswordSection({ userEmail, setServerError }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleSendPasswordResetLink = async () => {
        setErrorMessage(null);
        setSuccessMessage(null);
        setServerError(null);
        setIsSubmitting(true);

        try {
            await axios.post(
                "http://localhost:8080/api/user/password-reset-request",
                {
                    email: userEmail
                },
                { headers: { "Content-Type": "application/json" } }
            );
            setSuccessMessage("Посилання для скидання пароля було надіслано на вашу електронну пошту.");
            setCountdown(60);
            setTimeout(() => setSuccessMessage(null), 5000);
        } catch (err) {
            if (err.response) {
                const apiError = err.response.data?.message || err.response.data || "Не вдалося надіслати посилання для скидання пароля.";
                setErrorMessage(apiError);
                setServerError(apiError);
            } else {
                const genericError = "Сталася помилка. Будь ласка, спробуйте ще раз.";
                setErrorMessage(genericError);
                setServerError(genericError);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.settingsForm}>
            <h3 className={styles.sectionTitle}>Змінити Ваш Пароль</h3>

            {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

            <div className={styles.formGroup}>
                <p className={styles.formHelp}>
                    Натисніть кнопку нижче, щоб надіслати посилання для скидання пароля на вашу зареєстровану електронну адресу.
                </p>
                <button
                    type="button"
                    className={styles.btn}
                    onClick={handleSendPasswordResetLink}
                    disabled={isSubmitting || countdown > 0}
                >
                    {isSubmitting
                        ? "Надсилання посилання..."
                        : countdown > 0
                            ? `Надіслати повторно через ${countdown}с`
                            : "Надіслати посилання для скидання пароля"}
                </button>
            </div>
        </div>
    );
}