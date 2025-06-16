import React, { useState } from 'react';
import styles from '../components/styles/DeleteConfirmation.module.css';
import axios from 'axios';
const DeleteConfirmation = ({ onCancel, onConfirm, replyText, postId, isMainPost, isNews }) => {
    const [isChecked, setIsChecked] = useState(false);
    let endpoint = isMainPost ? 'thread' : 'reply';
    endpoint = isNews ? 'news' : endpoint;
    console.log('test')
    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isChecked) {
            handleDelete()
        }
    };
    const handleDelete = async () => {
        const paylaod = `http://localhost:8080/api/${endpoint}/${postId}`
        const response = await axios.delete(
            paylaod,
            {
                withCredentials: true,
            }
        ).then((response) => {
            if (endpoint === 'news') {
                console.log(response.data)
                onConfirm()
            } else {
                onConfirm(isMainPost ? response.data.topicId : postId, isMainPost);
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Видалити відповідь</h3>

            <div className={styles.content}>
                <p>Ви впевнені, що хочете видалити цю відповідь?</p>
                <div className={styles.replyPreview}>
                    {replyText ? replyText : "Ця відповідь буде видалена назавжди."}
                </div>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                <label className={styles.checkboxContainer}>
                    <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                        className={styles.checkbox}
                    />
                    <span className={styles.checkmark}></span>
                    <span>Я розумію, що ця дія не може бути скасована</span>
                </label>

                <div className={styles.buttonGroup}>
                    <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={onCancel}
                    >
                        Відмінити
                    </button>
                    <button
                        type="submit"
                        className={`${styles.deleteButton} ${!isChecked ? styles.disabled : ''}`}
                        disabled={!isChecked}
                    >
                        Видалити
                    </button>
                </div>
            </form>

        </div>

    );
};

export default DeleteConfirmation;