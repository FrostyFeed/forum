import styles from './styles/verification.module.css'
export default function ExpiredLink() {
    return (
        <main className={styles.mainContent}>
            <div className={styles.expiredCard}>
                <div className={styles.cardIcon}>⚠️</div>
                <h1 className={styles.cardTitle}>Посилання для підтвердження спливло</h1>
                <p className={styles.cardText}>
                    Посилання для підтвердження електронної пошти, на яке ви натиснули, спливло або більше недійсне.
                </p>

                <div className={styles.helpSection}>
                    <p className={styles.cardText}>
                        Якщо у вас залишаються проблеми, будь ласка, зв’яжіться з нашою службою підтримки за адресою <a href="mailto:support@darkforum.com" className={styles.helpLink}>support@darkforum.com</a>
                    </p>
                </div>
            </div>
        </main>

    )
}