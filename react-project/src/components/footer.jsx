import styles from './styles/footer.module.css';
import globalStyles from './styles/global.module.css';
export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={`${globalStyles.container} ${styles.footerContent}`}>
                <ul className={styles.footerLinks}>
                </ul>
                <div className={styles.copyright}>© 2025 DarkForum. Всі права захищені.</div>
            </div>
        </footer>
    )
}