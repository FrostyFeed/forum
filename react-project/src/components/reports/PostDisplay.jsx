import React from 'react';
import styles from './PostDisplay.module.css';
import formatDate from '../util/dateFormat';
import DOMPurify from 'dompurify';
const PostDisplay = ({ postData }) => {
    if (!postData) {
        return (
            <div className={styles.postContainer}>
                <p>Дані допису не надано.</p>
            </div>
        );
    }

    const { id, postContent, postCreationDate } = postData;

    const createMarkup = (htmlString) => {
        if (typeof htmlString === 'string') {
            return { __html: DOMPurify.sanitize(htmlString) };
        }
        return { __html: '<p>Невірний формат вмісту.</p>' };
    };

    const formattedDate = postCreationDate
        ? formatDate(postCreationDate)
        : 'Дату не знайдено';

    return (
        <div className={styles.postContainer}>

            {postContent ? (
                <div
                    className={styles.postContent}
                    dangerouslySetInnerHTML={createMarkup(postContent)}
                />
            ) : (
                <p className={styles.postContent}><em>Вміст для цього допису відсутній.</em></p>
            )}

            <p className={styles.creationDate}>
                Опубліковано: {formattedDate}
            </p>
        </div>
    );
};


export default PostDisplay;