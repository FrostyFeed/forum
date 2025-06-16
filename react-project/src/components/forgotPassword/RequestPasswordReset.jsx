import { useState } from "react";
import { z } from "zod";
import axios from "axios";
import styles from "./requestPasswordReset.module.css";
import globalStyles from '../styles/global.module.css';

const requestPasswordResetSchema = z.object({
    email: z
        .string()
        .min(1, "Електронна пошта є обов'язковою")
        .email("Будь ласка, введіть дійсну електронну адресу."),
});

export default function RequestPasswordReset() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setEmail(e.target.value);
        setError(null);
        setSuccessMessage(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        try {
            requestPasswordResetSchema.parse({ email });
            setIsSubmitting(true);


            await axios.post(
                "http://localhost:8080/api/user/password-reset-request",
                { email: email },
                { headers: { "Content-Type": "application/json" } }
            );

            setSuccessMessage(
                "Якщо акаунт з такою електронною поштою існує, посилання для скидання пароля було надіслано. Будь ласка, перевірте свою поштову скриньку."
            );
            setEmail("");

        } catch (err) {
            if (err instanceof z.ZodError) {
                setError(err.errors[0].message);
            } else if (err.response) {
                const apiError = err.response.data?.message || err.response.data || "Не вдалося надіслати посилання для скидання.";
                setError(apiError);
            } else {
                console.error("Помилка запиту скидання пароля:", err);
                const genericError = "Сталася помилка. Будь ласка, спробуйте пізніше.";
                setError(genericError);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className={`${globalStyles.container} ${globalStyles.mainContent}`}>
            <div className={styles.requestResetContainer}>
                <form onSubmit={handleSubmit} className={styles.requestResetForm}>
                    <h2 className={styles.requestResetTitle}>Скинути Ваш Пароль</h2>
                    <p className={styles.formSubtitle}>
                        Введіть свою електронну адресу нижче, і ми надішлемо вам посилання для скидання пароля.
                    </p>

                    {successMessage && <div className={styles.requestResetSuccess}>{successMessage}</div>}
                    {error && <div className={styles.requestResetError}>{error}</div>}

                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.inputLabel}>Електронна адреса</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className={styles.formInput}
                            value={email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            autoComplete="email"
                            disabled={isSubmitting}
                        />
                    </div>

                    <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                        {isSubmitting ? "Надсилання посилання..." : "Надіслати посилання для скидання"}
                    </button>
                </form>
            </div>
        </main>
    );
}