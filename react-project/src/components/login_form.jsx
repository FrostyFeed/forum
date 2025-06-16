import styles from './styles/login.module.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { z } from 'zod';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';

const loginSchema = z.object({
    email: z.string().email('Введіть дійсну адресу електронної пошти'),
    password: z
        .string()
        .min(8, 'Пароль має містити щонайменше 8 символів')
        .regex(/^[a-zA-Z0-9]+$/, 'Пароль може містити лише літери та цифри')
});

export default function Login_form() {
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember: false
    });
    const navigate = useNavigate();
    const { login } = useAuth();
    const location = useLocation();

    const locationMessage = location.state?.message;

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            loginSchema.parse({
                email: formData.email,
                password: formData.password
            });

            setIsError(false);
            setErrorMessage('');
            const res = await axios.post('http://localhost:8080/api/auth/login',
                formData,
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                });
            localStorage.setItem('rememberMe', formData.remember);
            login(res.data);
            navigate('/');
        } catch (error) {
            if (location.state?.message) {
                navigate(location.pathname, { replace: true, state: {} });
            }

            if (error.response?.data?.errorCode === "USER_BANNED") {
                setErrorMessage("Ваш акаунт заблоковано. Залишок часу: " + error.response.data.duration);
            } else if (error.response?.data?.error) {
                setErrorMessage(error.response.data.error);
            } else if (error.errors && error.errors[0]) {
                setErrorMessage(error.errors[0].message);
            } else {
                setErrorMessage('Сталася непередбачена помилка. Будь ласка, спробуйте ще раз.');
            }
            setIsError(true);
        }
    }

    return (
        <main className={styles.mainContent}>
            <div className={`${styles.container} ${styles.centerContainer}`}>
                <div className={styles.authContainer}>
                    <h2 className={styles.formTitle}>Увійдіть у свій акаунт</h2>

                    {locationMessage && !isError && (
                        <div className={styles.infoMessage}>
                            <p>{locationMessage}</p>
                        </div>
                    )}

                    {isError && (
                        <div className={styles.messageBox}>
                            <div className={styles.errorIcon}>!</div>
                            <p>{errorMessage}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label htmlFor="email">Адреса електронної пошти</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={styles.formControl}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="password">Пароль</label>
                            <div className={styles.passwordContainer}>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={styles.formControl}
                                    required
                                />
                                <button
                                    type="button"
                                    className={styles.togglePassword}
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? "Приховати" : "Показати"}
                                </button>
                            </div>
                            <Link to="/user/request-password-reset" className={styles.forgotPassword}>Забули пароль?</Link>
                        </div>
                        <div className={styles.rememberMe}>
                            <input
                                type="checkbox"
                                id="remember"
                                name="remember"
                                checked={formData.remember}
                                onChange={handleChange}
                            />
                            <label htmlFor="remember">Запам’ятати мене</label>
                        </div>
                        <button type="submit" className={styles.btn}>Увійти</button>
                        <div className={styles.formFooter}>
                            Немає акаунта? <Link to='/register'>Зареєструватися</Link>
                        </div>
                    </form>
                </div>
            </div>
        </main >
    )
}