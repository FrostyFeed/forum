import styles from './styles/login.module.css';
export default function Login_form() {
    return (
        <main className={styles.mainContent}>
            <div className={`${styles.container} ${styles.centerContainer}`}>
                <div className={styles.authContainer}>
                    <h2 className={styles.formTitle}>Login to Your Account</h2>
                    <form >
                        <div className={styles.formGroup}>
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className={styles.formControl}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="password">Password</label>
                            <div className={styles.passwordContainer}>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    className={styles.formControl}
                                    required
                                />
                                <button
                                    type="button"
                                    className={styles.togglePassword}
                                >
                                    Show
                                </button>
                            </div>
                            <a href="forgot-password.html" className={styles.forgotPassword}>Forgot your password?</a>
                        </div>
                        <div className={styles.rememberMe}>
                            <input
                                type="checkbox"
                                id="remember"
                                name="remember"
                            />
                            <label htmlFor="remember">Remember me</label>
                        </div>
                        <button type="submit" className={styles.btn}>Login</button>
                        <div className={styles.formFooter}>
                            Don't have an account? <a href="register.html">Register now</a>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    )
}