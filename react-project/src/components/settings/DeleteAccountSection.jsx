import { useState, useEffect } from "react";
import { z } from "zod";
import axios from "axios";
import styles from "./styles/settings.module.css";
import { useAuth } from "../../context/AuthContext";
const deleteAccountSchema = z.object({
    confirmDelete: z
        .literal(true, {
            errorMap: () => ({ message: "Ви повинні підтвердити цю дію" })
        }),
    password: z
        .string()
        .min(1, "Пароль є обов'язковим")
});
export default function DeleteAccountSection({ setServerError }) {
    const [formState, setFormState] = useState({ password: "", confirmDelete: false });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { logout } = useAuth();
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormState({ ...formState, [name]: type === "checkbox" ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setServerError(null);

        try {
            deleteAccountSchema.parse(formState);
            setIsSubmitting(true);

            const confirmDeletion = window.confirm(
                "Цю дію не можна скасувати. Ви впевнені, що хочете назавжди видалити свій обліковий запис?");

            if (confirmDeletion) {
                await axios.delete("http://localhost:8080/api/user", {
                    data: { password: formState.password },
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                });
                window.location.href = "/";
                logout()
            } else {
                setIsSubmitting(false);
            }
        } catch (err) {
            if (err instanceof z.ZodError) {
                setError(err.errors[0].message);
            } else if (err.response) {
                setServerError(err.response.data?.message || err.response.data || "Не вдалося видалити акаунт.");
            } else {
                setServerError("Сталася помилка. Будь ласка, спробуйте ще раз.");
            }
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.settingsForm}>
            <h3 className={styles.sectionTitle}>Видалити Ваш Акаунт</h3>
            <div className={styles.warningBox}>
                <strong>Увага:</strong> Ця дія є безповоротною і не може бути скасована. Усі ваші дані буде назавжди видалено.
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="deletePassword">Введіть Ваш Пароль</label>
                <div className={styles.passwordContainer}>
                    <input
                        type={showPassword ? "text" : "password"}
                        id="deletePassword"
                        name="password"
                        className={styles.formControl}
                        value={formState.password}
                        onChange={handleChange}
                    />
                    <button type="button" className={styles.togglePassword} onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? "Приховати" : "Показати"}
                    </button>
                </div>
            </div>
            <div className={styles.formGroup}>
                <div className={styles.confirmDeleteContainer}>
                    <input
                        type="checkbox"
                        id="confirmDelete"
                        name="confirmDelete"
                        checked={formState.confirmDelete}
                        onChange={handleChange}
                    />
                    <label htmlFor="confirmDelete">
                        Я розумію, що ця дія є безповоротною і мій акаунт не можна буде відновити
                    </label>
                </div>
                {error && <div className={styles.errorMessage}>{error}</div>}
            </div>
            <button type="submit" className={styles.deleteBtn} disabled={isSubmitting}>
                {isSubmitting ? "Обробка..." : "Видалити Мій Акаунт"}
            </button>
        </form>
    );
}