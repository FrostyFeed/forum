import { useState, useEffect } from "react";
import { z } from "zod";
import axios from "axios";
import styles from "./styles/settings.module.css";
const nicknameSchema = z.object({
    nickname: z
        .string()
        .min(3, "Нікнейм повинен містити щонайменше 3 символи")
        .max(20, "Нікнейм повинен містити щонайбільше 20 символів")
});
export default function NicknameSection({ user, setGlobalUserData, setServerError }) {
    const [nickname, setNickname] = useState(user.username || "");
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        setNickname(user.username || "");
    }, [user.username]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setServerError(null);
        setSuccessMessage(null);

        try {
            nicknameSchema.parse({ nickname });
            setIsSubmitting(true);

            await axios.patch(
                "http://localhost:8080/api/user/nickname",
                {
                    nickname: nickname,
                    id: user.id
                },
                { headers: { "Content-Type": "application/json" } }
            );

            setGlobalUserData(prev => ({ ...prev, username: nickname }));
            setSuccessMessage("Нікнейм успішно оновлено!");
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            if (err instanceof z.ZodError) {
                setError(err.errors[0].message);
            } else if (err.response) {
                setServerError(err.response.data?.message || err.response.data || "Не вдалося оновити нікнейм.");
            } else {
                setServerError("Сталася помилка. Будь ласка, спробуйте ще раз.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.settingsForm}>
            <h3 className={styles.sectionTitle}>Оновити Ваш Нікнейм</h3>
            {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
            <div className={styles.formGroup}>
                <label htmlFor="nickname">Новий нікнейм</label>
                <input
                    type="text"
                    id="nickname"
                    name="nickname"
                    className={styles.formControl}
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                />
                <div className={styles.formHelp}>Оберіть унікальний нікнейм від 3 до 20 символів</div>
                {error && <div className={styles.errorMessage}>{error}</div>}
            </div>
            <button type="submit" className={styles.btn} disabled={isSubmitting}>
                {isSubmitting ? "Оновлення..." : "Оновити нікнейм"}
            </button>
        </form>
    );
}