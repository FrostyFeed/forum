import { useState, useEffect } from "react";
import { z } from "zod";
import axios from "axios";
import styles from "./styles/settings.module.css";
const avatarSchema = z.object({
    avatar: z
        .instanceof(FileList)
        .refine(
            (files) => files && files.length > 0,
            "Будь ласка, оберіть зображення."
        )
        .refine(
            (files) => files && files[0].size <= 5 * 1024 * 1024,
            "Зображення має бути меншим за 5 МБ"
        )
        .refine(
            (files) => {
                if (!files || files.length === 0) return true;
                const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                return validTypes.includes(files[0].type);
            },
            "Будь ласка, оберіть дійсний файл зображення (JPG, PNG, GIF, WEBP)"
        )
});
export default function AvatarSection({ user, setGlobalUserData, setServerError }) {
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setError(null);
        setServerError(null);
        setSuccessMessage(null);

        if (file) {
            try {
                avatarSchema.parse({ avatar: e.target.files });
                setAvatarFile(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setAvatarPreview(reader.result);
                };
                reader.readAsDataURL(file);
            } catch (err) {
                if (err instanceof z.ZodError) {
                    setError(err.errors[0].message);
                }
                setAvatarFile(null);
                setAvatarPreview(null);
                e.target.value = "";
            }
        } else {
            setAvatarFile(null);
            setAvatarPreview(null);
        }
    };

    const removeAvatarPreviewHandler = () => {
        setAvatarFile(null);
        setAvatarPreview(null);
        setError(null);
        const fileInput = document.getElementById("settingsAvatar");
        if (fileInput) {
            fileInput.value = "";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setServerError(null);
        setSuccessMessage(null);

        const fileInput = document.getElementById("settingsAvatar");
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            setError("Будь ласка, оберіть зображення для завантаження.");
            return;
        }

        try {
            avatarSchema.parse({ avatar: fileInput.files });
            setIsSubmitting(true);

            const formData = new FormData();
            formData.append("avatar", fileInput.files[0]);

            const response = await axios.patch(
                "http://localhost:8080/api/user/avatar",
                {
                    newAvatar: fileInput.files[0],
                    id: user.id,
                    oldAvatar: user.avatarUrl
                },
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            setSuccessMessage("Зображення профілю успішно оновлено!");
            if (response.data && response.data.newAvatar) {
                setGlobalUserData(prev => ({ ...prev, avatarUrl: response.data.newAvatar }));
            }
            removeAvatarPreviewHandler();
            setTimeout(() => setSuccessMessage(null), 3000);

        } catch (err) {
            if (err instanceof z.ZodError) {
                setError(err.errors[0].message);
            } else if (err.response) {
                setServerError(err.response.data?.message || err.response.data || "Не вдалося оновити аватар.");
            } else {
                setServerError("Сталася помилка. Будь ласка, спробуйте ще раз.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.settingsForm}>
            <h3 className={styles.sectionTitle}>Оновити Зображення Профілю</h3>
            {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
            <div className={styles.formGroup}>
                <div className={styles.avatarSelection}>
                    <input
                        type="file"
                        id="settingsAvatar"
                        name="avatar"
                        accept="image/*"
                        className={styles.fileInput}
                        onChange={handleFileChange}
                    />
                    <div className={styles.avatarPreview}>
                        {avatarPreview ? (
                            <img src={avatarPreview} alt="Попередній перегляд аватара" className={styles.avatarImage} />
                        ) : user.avatarUrl ? (
                            <img src={user.avatarUrl} alt="Поточний аватар" className={styles.avatarImage} />
                        ) : (
                            <div className={styles.avatarPlaceholder}><span>Зображення не вибрано</span></div>
                        )}
                    </div>
                    <label htmlFor="settingsAvatar" className={styles.avatarButton}>
                        Вибрати Нове Зображення
                    </label>
                    {avatarPreview && (
                        <button type="button" className={styles.removeAvatarBtn} onClick={removeAvatarPreviewHandler}>
                            Видалити
                        </button>
                    )}
                </div>
                <div className={styles.formHelp}>Завантажте зображення профілю (JPG, PNG, GIF, WEBP, до 5МБ)</div>
                {error && <div className={styles.errorMessage}>{error}</div>}
            </div>
            <button type="submit" className={styles.btn} disabled={isSubmitting || !avatarFile}>
                {isSubmitting ? "Завантаження..." : "Оновити Зображення Профілю"}
            </button>
        </form>
    );
}