import { useState } from "react";
import styles from "./styles/register.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";

const registerSchema = z.object({
    username: z
        .string()
        .min(3, "Ім'я користувача повинно містити щонайменше 3 символи")
        .max(20, "Ім'я користувача повинно містити щонайбільше 20 символів"),
    email: z
        .string()
        .email("Будь ласка, введіть дійсну адресу електронної пошти"),
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
                const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
                return validTypes.includes(files[0].type);
            },
            "Будь ласка, виберіть дійсний файл зображення (JPG, PNG, WEBP)"
        ),
    password: z
        .string()
        .min(8, "Пароль повинен містити щонайменше 8 символів")
        .regex(/^[a-zA-Z0-9]+$/, "Пароль повинен містити лише літери та цифри"),
    confirmPassword: z
        .string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Паролі не збігаються",
    path: ["confirmPassword"]
});

export default function Register_form() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [serverError, setServerError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        clearErrors,
        setValue
    } = useForm({
        resolver: zodResolver(registerSchema)
    });
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            // Create preview
            const reader = new FileReader();
            reader.onload = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);

            clearErrors('avatar');
        }
    };

    const removeAvatarPreview = () => {
        setAvatarPreview(null);
        setValue('avatar', null);
    };
    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            setServerError("");


            const formData = new FormData();
            formData.append("username", data.username);
            formData.append("email", data.email);
            formData.append("password", data.password);
            formData.append("confirmPassword", data.confirmPassword);


            const response = await axios.post(
                "http://localhost:8080/api/user/register",
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            );
            console.log("Registration successful:", response.data);
            const avatarFile = data.avatar && data.avatar[0];
            if (avatarFile) {
                const avatarFormData = new FormData();
                avatarFormData.append("avatar", avatarFile);

                axios.post(
                    `http://localhost:8080/api/user/avatar`,
                    avatarFormData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                ).catch(err => {
                    console.error("Background avatar upload failed. This will not affect the user's registration.", err);
                });
            }

            navigate('/login', { state: { message: 'На вашу електронну пошту надіслано повідомлення для підтвердження реєстрації.' } });

        } catch (error) {
            console.error("Registration error:", error.response.data);
            console.log(error);
            if (error.response) {
                const { data } = error.response;

                setServerError(data)
            } else if (error.request) {
                setServerError("Відсутня відповідь від сервера. Будь ласка, перевірте підключення до Інтернету.");
            } else {
                setServerError("Сталася помилка. Будь ласка, спробуйте ще раз.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <main className={styles.mainContent}>
            <div className={styles.centerContainer}>
                <div className={styles.authContainer}>
                    <h2 className={styles.formTitle}>Реєстрація</h2>

                    {serverError && (
                        <div className={styles.serverError}>
                            {serverError.email}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className={styles.formGroup}>
                            <label htmlFor="username">Ім'я користувача</label>
                            <input
                                type="text"
                                id="username"
                                className={styles.formControl}
                                {...register("username")}
                            />
                            <div className={styles.formHelp}>Виберіть унікальне ім'я користувача довжиною від 3 до 20 символів</div>
                            {errors.username && (
                                <div className={styles.errorMessage}>{errors.username.message}</div>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="email">Електронна адреса</label>
                            <input
                                type="email"
                                id="email"
                                className={styles.formControl}
                                {...register("email")}
                            />
                            <div className={styles.formHelp}>Ми надішлемо підтвердження на цю електронну адресу</div>
                            {errors.email && (
                                <div className={styles.errorMessage}>{errors.email.message}</div>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="avatar">Зображення профілю</label>
                            <div className={styles.avatarSelection}>
                                <input
                                    type="file"
                                    id="avatar"
                                    accept="image/*"
                                    className={styles.fileInput}
                                    {...register("avatar")}
                                    onChange={handleAvatarChange}
                                />
                                <div className={styles.avatarPreview}>
                                    {avatarPreview ? (
                                        <img
                                            src={avatarPreview}
                                            alt="Avatar preview"
                                            className={styles.avatarImage}
                                        />
                                    ) : (
                                        <div className={styles.avatarPlaceholder}>
                                            <span>Зображення не вибрано</span>
                                        </div>
                                    )}
                                </div>
                                <label htmlFor="avatar" className={styles.avatarButton}>
                                    Вибрати зображення
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
                            <div className={styles.formHelp}>Завантажте фото профілю (JPG, PNG, макс. 5 МБ)</div>
                            {errors.avatar && (
                                <div className={styles.errorMessage}>{errors.avatar.message}</div>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="password">Пароль</label>
                            <div className={styles.passwordContainer}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    className={styles.formControl}
                                    {...register("password")}
                                />
                                <button
                                    type="button"
                                    className={styles.togglePassword}
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? "Приховати" : "Показати"}
                                </button>
                            </div>
                            <div className={styles.formHelp}>Використовуйте принаймні 8 символів, тільки літери та цифри (без символів)</div>
                            {errors.password && (
                                <div className={styles.errorMessage}>{errors.password.message}</div>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="confirmPassword">Підтвердити пароль</label>
                            <div className={styles.passwordContainer}>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    className={styles.formControl}
                                    {...register("confirmPassword")}
                                />
                                <button
                                    type="button"
                                    className={styles.togglePassword}
                                    onClick={toggleConfirmPasswordVisibility}
                                >
                                    {showConfirmPassword ? "Приховати" : "Показати"}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <div className={styles.errorMessage}>{errors.confirmPassword.message}</div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className={styles.btn}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Реєстрація..." : "Зареєструватися"}
                        </button>

                        <div className={styles.formFooter}>
                            Вже маєте акаунт? <Link to="/login">Увійти </Link>
                        </div>
                    </form>
                </div>
            </div>

        </main>
    );
}