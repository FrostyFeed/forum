import { useState } from "react";
import { z } from "zod";
import axios from "axios";
import styles from "./setNewPassword.module.css";
import globalStyles from '../styles/global.module.css'

const setNewPasswordSchema = z.object({
    password: z
        .string()
        .min(8, "Пароль повинен містити щонайменше 8 символів")
        .regex(/^[a-zA-Z0-9]+$/, "Пароль повинен містити лише літери та цифри"),
    confirmPassword: z
        .string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Паролі не співпадають",
    path: ["confirmPassword"]
});

export default function SetNewPassword({ token }) {
    const [formState, setFormState] = useState({
        password: "",
        confirmPassword: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    console.log(token)

    const handleChange = (e) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
        setError(null);
        setSuccessMessage(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        try {
            setNewPasswordSchema.parse(formState);
            setIsSubmitting(true);

            await axios.patch(
                "http://localhost:8080/api/user/password-reset",
                {
                    jwt: token,
                    password: formState.password,
                    confirmPassword: formState.confirmPassword
                },
                { headers: { "Content-Type": "application/json" } }
            );

            setSuccessMessage("Ваш пароль успішно оновлено. Тепер ви можете увійти, використовуючи новий пароль.");
            setFormState({ password: "", confirmPassword: "" });

        } catch (err) {
            if (err instanceof z.ZodError) {
                setError(err.errors[0].message);
            } else if (err.response) {
                const apiError = err.response.data?.message || err.response.data || "Не вдалося встановити новий пароль.";
                setError(apiError);
            } else {
                console.log(err);
                const genericError = "Сталася помилка. Будь ласка, спробуйте ще раз.";
                setError(genericError);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className={`${globalStyles.container} ${globalStyles.mainContent}`}>
            <div className={styles.setPasswordContainer}>
                <form onSubmit={handleSubmit} className={styles.setPasswordForm}>
                    <h2 className={styles.setPasswordTitle}>Встановіть Ваш Новий Пароль</h2>

                    {successMessage && <div className={styles.setPasswordSuccess}>{successMessage}</div>}
                    {error && <div className={styles.setPassError}>{error}</div>}


                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.inputLabel}>Новий Пароль</label>
                        <div className={styles.passwordInputWrapper}>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                className={styles.formInput}
                                value={formState.password}
                                onChange={handleChange}
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                className={styles.passwordToggle}
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Приховати пароль" : "Показати пароль"}
                            >
                                {showPassword ? "Приховати" : "Показати"}
                            </button>
                        </div>
                        <p className={styles.helpText}>
                            Повинен містити щонайменше 8 символів. Тільки літери та цифри.
                        </p>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="confirmPassword" className={styles.inputLabel}>Підтвердьте Новий Пароль</label>
                        <div className={styles.passwordInputWrapper}>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                name="confirmPassword"
                                className={styles.formInput}
                                value={formState.confirmPassword}
                                onChange={handleChange}
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                className={styles.passwordToggle}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                aria-label={showConfirmPassword ? "Приховати підтвердження пароля" : "Показати підтвердження пароля"}
                            >
                                {showConfirmPassword ? "Приховати" : "Показати"}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                        {isSubmitting ? "Встановлення пароля..." : "Встановити Новий Пароль"}
                    </button>
                </form>
            </div>

        </main>
    );
}