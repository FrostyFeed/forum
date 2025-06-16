import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './GoBackButton.module.css';

const GoBackButton = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <button onClick={handleGoBack} className={styles.goBackButton}>
            <span aria-hidden="true">←</span>
        </button>
    );
};

export default GoBackButton;