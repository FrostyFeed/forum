import React, { useState } from 'react';
import styles from './SideMenu.module.css';
const menuItemsData = [
    { id: 'home', name: 'Home' },
    { id: 'profile', name: 'Profile' },
    { id: 'settings', name: 'Settings' },
    { id: 'logout', name: 'Logout' },
];

const icon = (
    <img
        src='https://cdn-icons-png.flaticon.com/128/2040/2040504.png'
        alt='logo'
        width='20'
        height='20'
    />
);

const SideMenu = ({ onMenuItemClick }) => {
    const [activeItem, setActiveItem] = useState(menuItemsData[0]?.id || '');

    const handleItemClick = (itemId, itemName) => {
        setActiveItem(itemId);
        if (onMenuItemClick) {
            onMenuItemClick(itemId, itemName);
        }
        console.log(`Menu item clicked: ${itemName} (ID: ${itemId})`);
    };

    return (
        <nav className={styles.menuContainer}>
            <ul className={styles.menuList}>
                {menuItemsData.map((item) => (
                    <li
                        key={item.id}
                        className={`${styles.menuItem} ${activeItem === item.id ? styles.active : ''}`}
                        onClick={() => handleItemClick(item.id, item.name)}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => e.key === 'Enter' && handleItemClick(item.id, item.name)}
                    >
                        <span className={styles.menuIcon}>{item.icon}</span>
                        <span className={styles.menuName}>{item.name}</span>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default SideMenu;