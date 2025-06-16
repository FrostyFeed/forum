import React, { useState, useEffect } from 'react';
import styles from '../components/styles/ScrollToTopButton.module.css';

function ScrollToTopButton() {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className={styles.scrollToTopButton}
                    aria-label="Scroll to top"
                >
                    ↑
                </button>
            )}
        </>
    );
}

export default ScrollToTopButton;