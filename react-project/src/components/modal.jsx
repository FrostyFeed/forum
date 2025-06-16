import React from 'react';
import styles from './styles/modal.module.css';

export default function Modal({ isOpen, onClose, children }) {
    if (!isOpen) {
        return null;
    }

    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={handleContentClick}>

                {children}
            </div>
        </div>
    );
}