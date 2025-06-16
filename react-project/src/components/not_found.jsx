import React from 'react';
import styles from './styles/notFound.module.css';

const NotFound404 = () => {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.navContainer}>
                    <div className={styles.logo}>DarkForum</div>
                    <ul className={styles.navMenu}>
                        <li><a href="/">Головна</a></li>
                        <li><a href="/categories">Категорії</a></li>
                        <li><a href="/members">Учасники</a></li>
                        <li><a href="/recent">Останні</a></li>
                        <li><a href="/rules">Правила</a></li>
                        <li><a href="/search">Пошук</a></li>
                    </ul>
                    <div className={styles.loginArea}>
                        <a href="/login" className={styles.loginBtn}>Увійти</a>
                        <a href="/register" className={styles.registerBtn}>Реєстрація</a>
                    </div>
                </div>
            </header>

            <main className={styles.mainContent}>
                <div className={styles.errorContainer}>
                    <div className={styles.errorCode}>404</div>
                    <div className={styles.glitchEffect}>
                        <div className={styles.glitchLine}></div>
                        <div className={styles.glitchLine}></div>
                        <div className={styles.glitchLine}></div>
                    </div>
                    <h1 className={styles.errorTitle}>Сторінку не знайдено</h1>
                    <p className={styles.errorText}>
                        Сторінка, яку ви шукаєте, не існує або була переміщена.
                    </p>

                    <div className={styles.buttonGroup}>
                        <a href="/" className={styles.primaryBtn}>
                            Повернутись на головну
                        </a>
                    </div>
                </div>
            </main>

            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    <ul className={styles.footerLinks}>
                        <li><a href="/contact">Контакти</a></li>
                        <li><a href="/privacy">Політика конфіденційності</a></li>
                        <li><a href="/terms">Умови використання</a></li>
                        <li><a href="/about">Про нас</a></li>
                        <li><a href="/faq">Питання та відповіді</a></li>
                    </ul>
                    <div className={styles.copyright}>© 2025 DarkForum. Всі права захищені.</div>
                </div>
            </footer>
        </div>
    );
};


export default NotFound404;