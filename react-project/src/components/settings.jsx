import { useState } from "react";
import { z } from "zod";
import axios from "axios";
import styles from "../components/styles/settings.module.css";

const nicknameSchema = z.object({
    nickname: z
        .string()
        .min(3, "Псевдонім повинен містити не менше 3 символів")
        .max(20, "Псевдонім повинен містити не більше 20 символів")
});

const avatarSchema = z.object({
    avatar: z
        .instanceof(FileList)
        .optional()
        .refine(
            (files) => !files || files.length === 0 || files[0].size <= 5 * 1024 * 1024,
            "Розмір зображення має бути меншим за 5 МБ"
        )
        .refine(
            (files) => {
                if (!files || files.length === 0) return true;
                const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                return validTypes.includes(files[0].type);
            },
            "Будь ласка, виберіть дійсний файл зображення (JPG, PNG, GIF, WEBP)"
        )
});

const passwordSchema = z.object({
    currentPassword: z
        .string()
        .min(1, "Потрібен поточний пароль"),
    verificationCode: z
        .string()
        .min(6, "Код підтвердження повинен містити не менше 6 символів")
        .max(8, "Код підтвердження повинен містити не більше 8 символів"),
    newPassword: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/^[a-zA-Z0-9]+$/, "Пароль повинен містити лише літери та цифри"),
    confirmNewPassword: z
        .string()
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Паролі не співпадають",
    path: ["confirmNewPassword"]
});

const deleteAccountSchema = z.object({
    confirmDelete: z
        .literal(true, {
            errorMap: () => ({ message: "Ви повинні підтвердити цю дію" })
        }),
    password: z
        .string()
        .min(1, "Потрібен пароль")
});

export default function Settings() {
    const [userData, setUserData] = useState({
        username: "",
        email: "",
        avatar: null
    });

    const [activeSection, setActiveSection] = useState("nickname");

    const [nicknameForm, setNicknameForm] = useState({ nickname: userData.username });
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        verificationCode: "",
        newPassword: "",
        confirmNewPassword: ""
    });
    const [deleteForm, setDeleteForm] = useState({ confirmDelete: false, password: "" });

    const [avatarPreview, setAvatarPreview] = useState(null);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showDeletePassword, setShowDeletePassword] = useState(false);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const [isSubmitting, setIsSubmitting] = useState({
        nickname: false,
        avatar: false,
        password: false,
        deleteAccount: false,
        sendCode: false
    });

    const [errors, setErrors] = useState({
        nickname: null,
        avatar: null,
        password: null,
        verificationCode: null,
        deleteAccount: null,
        server: null
    });

    const [success, setSuccess] = useState({
        nickname: false,
        avatar: false,
        password: false,
        verificationCode: false
    });

    const handleTabChange = (section) => {
        setActiveSection(section);
        setErrors({ ...errors, server: null });
    };

    const handleNicknameChange = (e) => {
        setNicknameForm({ ...nicknameForm, nickname: e.target.value });
    };

    const handleNicknameSubmit = async (e) => {
        e.preventDefault();
        setErrors({ ...errors, nickname: null, server: null });
        setSuccess({ ...success, nickname: false });

        try {
            nicknameSchema.parse(nicknameForm);

            setIsSubmitting({ ...isSubmitting, nickname: true });

            const response = await axios.patch(
                "http://localhost:8080/api/user/settings/nickname",
                { nickname: nicknameForm.nickname },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            setUserData({ ...userData, username: nicknameForm.nickname });
            setSuccess({ ...success, nickname: true });

            setTimeout(() => {
                setSuccess({ ...success, nickname: false });
            }, 3000);

        } catch (error) {
            if (error instanceof z.ZodError) {
                setErrors({ ...errors, nickname: error.errors[0].message });
            } else if (error.response) {
                setErrors({ ...errors, server: error.response.data });
            } else {
                setErrors({ ...errors, server: "Сталася помилка. Спробуйте ще раз." });
            }
        } finally {
            setIsSubmitting({ ...isSubmitting, nickname: false });
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        setErrors({ ...errors, avatar: null, server: null });

        if (file) {
            try {
                avatarSchema.parse({ avatar: e.target.files });

                const reader = new FileReader();
                reader.onload = () => {
                    setAvatarPreview(reader.result);
                };
                reader.readAsDataURL(file);
            } catch (error) {
                if (error instanceof z.ZodError) {
                    setErrors({ ...errors, avatar: error.errors[0].message });
                }
            }
        }
    };

    const removeAvatarPreview = () => {
        setAvatarPreview(null);
        document.getElementById("settingsAvatar").value = "";
    };

    const handleAvatarSubmit = async (e) => {
        e.preventDefault();
        setErrors({ ...errors, avatar: null, server: null });
        setSuccess({ ...success, avatar: false });

        const fileInput = document.getElementById("settingsAvatar");

        if (!fileInput.files || fileInput.files.length === 0) {
            setErrors({ ...errors, avatar: "Будь ласка, виберіть зображення для завантаження" });
            return;
        }

        try {
            avatarSchema.parse({ avatar: fileInput.files });

            setIsSubmitting({ ...isSubmitting, avatar: true });

            const formData = new FormData();
            formData.append("avatar", fileInput.files[0]);

            const response = await axios.patch(
                "http://localhost:8080/api/user/settings/avatar",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setSuccess({ ...success, avatar: true });

            setTimeout(() => {
                setSuccess({ ...success, avatar: false });
            }, 3000);

        } catch (error) {
            if (error instanceof z.ZodError) {
                setErrors({ ...errors, avatar: error.errors[0].message });
            } else if (error.response) {
                setErrors({ ...errors, server: error.response.data });
            } else {
                setErrors({ ...errors, server: "Сталася помилка. Спробуйте ще раз." });
            }
        } finally {
            setIsSubmitting({ ...isSubmitting, avatar: false });
        }
    };

    const handlePasswordChange = (e) => {
        setPasswordForm({
            ...passwordForm,
            [e.target.name]: e.target.value
        });
    };

    const handleSendCode = async () => {
        setErrors({ ...errors, verificationCode: null, server: null });

        if (!passwordForm.currentPassword) {
            setErrors({ ...errors, verificationCode: "Потрібен поточний пароль" });
            return;
        }

        try {
            setIsSubmitting({ ...isSubmitting, sendCode: true });

            const response = await axios.post(
                "http://localhost:8080/api/user/settings/send-code",
                { password: passwordForm.currentPassword },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            setIsCodeSent(true);
            setSuccess({ ...success, verificationCode: true });

            setCountdown(60);
            const interval = setInterval(() => {
                setCountdown((prevCount) => {
                    if (prevCount <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prevCount - 1;
                });
            }, 1000);

        } catch (error) {
            if (error.response) {
                setErrors({ ...errors, verificationCode: error.response.data });
            } else {
                setErrors({ ...errors, verificationCode: "Не вдалося надіслати код підтвердження" });
            }
        } finally {
            setIsSubmitting({ ...isSubmitting, sendCode: false });
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setErrors({ ...errors, password: null, server: null });
        setSuccess({ ...success, password: false });

        try {
            passwordSchema.parse(passwordForm);

            setIsSubmitting({ ...isSubmitting, password: true });

            const response = await axios.patch(
                "http://localhost:8080/api/user/settings/password",
                {
                    currentPassword: passwordForm.currentPassword,
                    verificationCode: passwordForm.verificationCode,
                    newPassword: passwordForm.newPassword
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            // Reset password form
            setPasswordForm({
                currentPassword: "",
                verificationCode: "",
                newPassword: "",
                confirmNewPassword: ""
            });

            setIsCodeSent(false);
            setSuccess({ ...success, password: true });

            setTimeout(() => {
                setSuccess({ ...success, password: false });
            }, 3000);

        } catch (error) {
            if (error instanceof z.ZodError) {
                setErrors({ ...errors, password: error.errors[0].message });
            } else if (error.response) {
                setErrors({ ...errors, server: error.response.data });
            } else {
                setErrors({ ...errors, server: "Сталася помилка. Спробуйте ще раз." });
            }
        } finally {
            setIsSubmitting({ ...isSubmitting, password: false });
        }
    };

    const handleDeleteFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setDeleteForm({
            ...deleteForm,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleDeleteAccount = async (e) => {
        e.preventDefault();
        setErrors({ ...errors, deleteAccount: null, server: null });

        try {
            deleteAccountSchema.parse(deleteForm);

            setIsSubmitting({ ...isSubmitting, deleteAccount: true });

            const confirmDeletion = window.confirm(
                "Цю дію неможливо скасувати. Ви впевнені, що хочете назавжди видалити свій акаунт?"
            );

            if (confirmDeletion) {
                const response = await axios.delete(
                    "http://localhost:8080/api/user/settings/delete-account",
                    {
                        data: { password: deleteForm.password },
                        headers: {
                            "Content-Type": "application/json",

                        },
                    }
                );


                window.location.href = "/";
            } else {
                setIsSubmitting({ ...isSubmitting, deleteAccount: false });
            }

        } catch (error) {
            if (error instanceof z.ZodError) {
                setErrors({ ...errors, deleteAccount: error.errors[0].message });
            } else if (error.response) {
                setErrors({ ...errors, server: error.response.data });
            } else {
                setErrors({ ...errors, server: "Сталася помилка. Спробуйте ще раз." });
            }
            setIsSubmitting({ ...isSubmitting, deleteAccount: false });
        }
    };

    return (
        <main className={styles.mainContent}>
            <div className={styles.centerContainer}>
                <div className={styles.settingsContainer}>
                    <h2 className={styles.settingsTitle}>Налаштування облікового запису</h2>

                    {errors.server && (
                        <div className={styles.serverError}>
                            {errors.server}
                        </div>
                    )}

                    <div className={styles.settingsTabs}>
                        <button
                            className={`${styles.tabButton} ${activeSection === "nickname" ? styles.activeTab : ""}`}
                            onClick={() => handleTabChange("nickname")}
                        >
                            Змінити псевдонім
                        </button>
                        <button
                            className={`${styles.tabButton} ${activeSection === "avatar" ? styles.activeTab : ""}`}
                            onClick={() => handleTabChange("avatar")}
                        >
                            Зображення профілю
                        </button>
                        <button
                            className={`${styles.tabButton} ${activeSection === "password" ? styles.activeTab : ""}`}
                            onClick={() => handleTabChange("password")}
                        >
                            Змінити пароль
                        </button>
                        <button
                            className={`${styles.tabButton} ${activeSection === "delete" ? styles.activeTab : ""}`}
                            onClick={() => handleTabChange("delete")}
                        >
                            Видалити обліковий запис
                        </button>
                    </div>

                    <div className={styles.settingsContent}>
                        {activeSection === "nickname" && (
                            <form onSubmit={handleNicknameSubmit} className={styles.settingsForm}>
                                <h3 className={styles.sectionTitle}>Оновіть свій псевдонім</h3>

                                {success.nickname && (
                                    <div className={styles.successMessage}>
                                        Псевдонім успішно оновлено!
                                    </div>
                                )}

                                <div className={styles.formGroup}>
                                    <label htmlFor="nickname">Новий псевдонім</label>
                                    <input
                                        type="text"
                                        id="nickname"
                                        name="nickname"
                                        className={styles.formControl}
                                        value={nicknameForm.nickname}
                                        onChange={handleNicknameChange}
                                    />
                                    <div className={styles.formHelp}>Виберіть унікальний псевдонім довжиною від 3 до 20 символів</div>
                                    {errors.nickname && (
                                        <div className={styles.errorMessage}>{errors.nickname}</div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className={styles.btn}
                                    disabled={isSubmitting.nickname}
                                >
                                    {isSubmitting.nickname ? "Оновлення..." : "Оновити псевдонім"}
                                </button>
                            </form>
                        )}

                        {activeSection === "avatar" && (
                            <form onSubmit={handleAvatarSubmit} className={styles.settingsForm}>
                                <h3 className={styles.sectionTitle}>Оновити зображення профілю</h3>

                                {success.avatar && (
                                    <div className={styles.successMessage}>
                                        Аватарку успішно оновлено!
                                    </div>
                                )}

                                <div className={styles.formGroup}>
                                    <div className={styles.avatarSelection}>
                                        <input
                                            type="file"
                                            id="settingsAvatar"
                                            name="avatar"
                                            accept="image/*"
                                            className={styles.fileInput}
                                            onChange={handleAvatarChange}
                                        />
                                        <div className={styles.avatarPreview}>
                                            {avatarPreview ? (
                                                <img
                                                    src={avatarPreview}
                                                    alt="Avatar preview"
                                                    className={styles.avatarImage}
                                                />
                                            ) : userData.avatar ? (
                                                <img
                                                    src={userData.avatar}
                                                    alt="Current avatar"
                                                    className={styles.avatarImage}
                                                />
                                            ) : (
                                                <div className={styles.avatarPlaceholder}>
                                                    <span>Зображення не вибрано</span>
                                                </div>
                                            )}
                                        </div>
                                        <label htmlFor="settingsAvatar" className={styles.avatarButton}>
                                            Виберіть нове зображення
                                        </label>
                                        {avatarPreview && (
                                            <button
                                                type="button"
                                                className={styles.removeAvatarBtn}
                                                onClick={removeAvatarPreview}
                                            >
                                                Видалити
                                            </button>
                                        )}
                                    </div>
                                    <div className={styles.formHelp}>Завантажте фото профілю (JPG, PNG, GIF, WEBP, макс. 5 МБ)</div>
                                    {errors.avatar && (
                                        <div className={styles.errorMessage}>{errors.avatar}</div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className={styles.btn}
                                    disabled={isSubmitting.avatar || !avatarPreview}
                                >
                                    {isSubmitting.avatar ? "Завантаження..." : "Оновити зображення профілю"}
                                </button>
                            </form>
                        )}

                        {activeSection === "password" && (
                            <form onSubmit={handlePasswordSubmit} className={styles.settingsForm}>
                                <h3 className={styles.sectionTitle}>Змініть свій пароль</h3>

                                {success.password && (
                                    <div className={styles.successMessage}>
                                        Пароль успішно оновлено!
                                    </div>
                                )}

                                <div className={styles.formGroup}>
                                    <label htmlFor="currentPassword">Поточний пароль</label>
                                    <div className={styles.passwordContainer}>
                                        <input
                                            type={showCurrentPassword ? "text" : "password"}
                                            id="currentPassword"
                                            name="currentPassword"
                                            className={styles.formControl}
                                            value={passwordForm.currentPassword}
                                            onChange={handlePasswordChange}
                                        />
                                        <button
                                            type="button"
                                            className={styles.togglePassword}
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        >
                                            {showCurrentPassword ? "Приховати" : "Показати"}
                                        </button>
                                    </div>
                                </div>

                                <div className={styles.verificationSection}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="verificationCode">Код підтвердження</label>
                                        <div className={styles.codeInputContainer}>
                                            <input
                                                type="text"
                                                id="verificationCode"
                                                name="verificationCode"
                                                className={styles.formControl}
                                                value={passwordForm.verificationCode}
                                                onChange={handlePasswordChange}
                                                disabled={!isCodeSent}
                                            />
                                            <button
                                                type="button"
                                                className={styles.sendCodeBtn}
                                                onClick={handleSendCode}
                                                disabled={isSubmitting.sendCode || countdown > 0}
                                            >
                                                {countdown > 0
                                                    ? `Повторно надіслати через ${countdown}s`
                                                    : isCodeSent
                                                        ? "Надіслати код повторно"
                                                        : isSubmitting.sendCode
                                                            ? "Відправлення..."
                                                            : "Надіслати код"}
                                            </button>
                                        </div>
                                        <div className={styles.formHelp}>
                                            {isCodeSent
                                                ? "Введіть код підтвердження, надісланий на вашу електронну адресу"
                                                : "Ми надішлемо код підтвердження на вашу електронну адресу"}
                                        </div>
                                        {errors.verificationCode && (
                                            <div className={styles.errorMessage}>{errors.verificationCode}</div>
                                        )}
                                        {success.verificationCode && (
                                            <div className={styles.successMessage}>
                                                Код підтвердження надіслано на вашу електронну адресу
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="newPassword">Новий пароль</label>
                                    <div className={styles.passwordContainer}>
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            id="newPassword"
                                            name="newPassword"
                                            className={styles.formControl}
                                            value={passwordForm.newPassword}
                                            onChange={handlePasswordChange}
                                            disabled={!isCodeSent}
                                        />
                                        <button
                                            type="button"
                                            className={styles.togglePassword}
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                        >
                                            {showNewPassword ? "Приховати" : "Показати"}
                                        </button>
                                    </div>
                                    <div className={styles.formHelp}>Використовуйте принаймні 8 символів, тільки літери та цифри (без символів)</div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="confirmNewPassword">Підтвердіть новий пароль</label>
                                    <div className={styles.passwordContainer}>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            id="confirmNewPassword"
                                            name="confirmNewPassword"
                                            className={styles.formControl}
                                            value={passwordForm.confirmNewPassword}
                                            onChange={handlePasswordChange}
                                            disabled={!isCodeSent}
                                        />
                                        <button
                                            type="button"
                                            className={styles.togglePassword}
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? "Приховати" : "Показати"}
                                        </button>
                                    </div>
                                </div>

                                {errors.password && (
                                    <div className={styles.errorMessage}>{errors.password}</div>
                                )}

                                <button
                                    type="submit"
                                    className={styles.btn}
                                    disabled={isSubmitting.password || !isCodeSent}
                                >
                                    {isSubmitting.password ? "Оновлення..." : "Оновити пароль"}
                                </button>
                            </form>
                        )}

                        {activeSection === "delete" && (
                            <form onSubmit={handleDeleteAccount} className={styles.settingsForm}>
                                <h3 className={styles.sectionTitle}>Видалити свій обліковий запис</h3>

                                <div className={styles.warningBox}>
                                    <strong>Увага:</strong> Цю дію неможливо скасувати. Всі ваші дані буде видалено назавжди.
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="password">Введіть свій пароль</label>
                                    <div className={styles.passwordContainer}>
                                        <input
                                            type={showDeletePassword ? "text" : "password"}
                                            id="deletePassword"
                                            name="password"
                                            className={styles.formControl}
                                            value={deleteForm.password}
                                            onChange={handleDeleteFormChange}
                                        />
                                        <button
                                            type="button"
                                            className={styles.togglePassword}
                                            onClick={() => setShowDeletePassword(!showDeletePassword)}
                                        >
                                            {showDeletePassword ? "Приховати" : "Показати"}
                                        </button>
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <div className={styles.confirmDeleteContainer}>
                                        <input
                                            type="checkbox"
                                            id="confirmDelete"
                                            name="confirmDelete"
                                            checked={deleteForm.confirmDelete}
                                            onChange={handleDeleteFormChange}
                                        />
                                        <label htmlFor="confirmDelete">
                                            Я розумію, що ця дія є остаточною і мій акаунт не може бути відновлений
                                        </label>
                                    </div>
                                    {errors.deleteAccount && (
                                        <div className={styles.errorMessage}>{errors.deleteAccount}</div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className={styles.deleteBtn}
                                    disabled={isSubmitting.deleteAccount}
                                >
                                    {isSubmitting.deleteAccount ? "Обробка..." : "Видалити мій акаунт"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}