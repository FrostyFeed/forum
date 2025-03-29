import { Link } from "react-router-dom"
import styles from './styles/header.module.css'
import globalStyles from './styles/global.module.css'
export default function Header() {
    return (
        <header className={styles.header}>
            <div className={`${globalStyles.container} ${styles.navContainer}`}>
                <div className={styles.logo}>DarkForum</div>
                <ul className={styles.navMenu}>
                    <li><Link to="/">Home</Link></li>
                    <li><a href="#">Categories</a></li>
                    <li><a href="#">Members</a></li>
                    <li><a href="#">Recent</a></li>
                    <li><a href="#">Rules</a></li>
                    <li><a href="#">Search</a></li>
                </ul>
                <div className={styles.loginArea}>
                    <Link to="login" className={styles.loginBtn}>Login</Link>
                    <a href="#" className={styles.registerBtn}>Register</a>
                </div>
            </div>
        </header>
    )
}