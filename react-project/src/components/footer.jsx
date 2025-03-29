import styles from './styles/footer.module.css';
import globalStyles from './styles/global.module.css';
export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={`${globalStyles.container} ${styles.footerContent}`}>
                <ul className={styles.footerLinks}>
                    <li><a href="#">Contact</a></li>
                    <li><a href="#">Privacy Policy</a></li>
                    <li><a href="#">Terms of Service</a></li>
                    <li><a href="#">About</a></li>
                    <li><a href="#">FAQ</a></li>
                </ul>
                <div className={styles.copyright}>© 2025 DarkForum. All rights reserved.</div>
            </div>
        </footer>
    )
}