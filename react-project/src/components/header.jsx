import { Link, useNavigate } from "react-router-dom"
import styles from './styles/header.module.css'
import globalStyles from './styles/global.module.css'
import { useState } from "react"
import { useAuth } from "../context/AuthContext.jsx"
import UserBanInfo from "./banInfo/UserBanInfo.jsx"
import axios from "axios"
export default function Header() {
    const navigate = useNavigate()
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { user, logout } = useAuth();
    console.log("Header user:", user);
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };
    const loadRandomPost = async () => {
        await axios.get('http://localhost:8080/api/thread/random').then((response) => {
            navigate('/thread/' + response.data);
        });

    }
    const isLoggedIn = user !== null;
    const isAdmin = user?.roles?.includes('ROLE_Admin');
    return (
        <header className={styles.header}>
            <div className={`${styles.navContainer}`}>
                <div className={styles.logo}>DarkForum</div>
                <ul className={styles.navMenu}>
                    <li><Link to="/">Головна сторінка</Link></li>
                    <li><Link to="/leaderboard">Таблиця лідерів</Link></li>
                    <li><Link to="/stats">Статистика</Link></li>
                    <li><Link to="/rules">Правила</Link></li>
                    <li><Link to="/news">Новини</Link></li>
                    <li onClick={loadRandomPost}><Link>Випадковий пост</Link></li>
                    {isAdmin && (
                        <li><Link to="/reports">Скарги</Link></li>
                    )}
                </ul>
                <div className={styles.loginArea}>
                    {isLoggedIn ? (
                        <div className={styles.userMenu}>
                            <div
                                className={styles.userProfile}
                                onClick={toggleDropdown}
                            >
                                <div className={styles.profilePicture}>
                                    <img src={user.avatarUrl} alt="Profile" />
                                </div>
                                <span className={styles.username}>{user.username}</span>
                            </div>

                            {dropdownOpen && (
                                <div className={styles.dropdown}>
                                    <div className={styles.dropdownItem} onClick={toggleDropdown}>
                                        <Link to={`/myposts/${user.id}`}>
                                            Мої пости
                                        </Link>
                                    </div>
                                    <div className={styles.dropdownItem} onClick={toggleDropdown}>
                                        <Link to={`/user/${user.id}`} >
                                            Профіль
                                        </Link>
                                    </div>
                                    <div className={styles.dropdownItem} onClick={toggleDropdown}>
                                        <Link to="/settings">
                                            Налаштування
                                        </Link>
                                    </div>

                                    {/* Item 2 */}
                                    <div className={styles.dropdownItem} onClick={toggleDropdown}>
                                        <Link to="/" onClick={logout}>
                                            Вийти
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link to="login" className={styles.loginBtn}>Авторизація</Link>
                            <Link to="register" className={styles.registerBtn}>Реєстрація</Link>
                        </>
                    )}
                </div>
            </div>
        </header>

    )
}