// NewsForm.js
import React, { useState, useEffect } from "react";
import styles from "./NewsForum.module.css";
import GlobalErrorDisplay from "../error/GlobalErrorDisplay";
import { ServerRouter } from "react-router-dom";

const NewsForm = ({ isOpen, onClose, onSave, initialData }) => {
    const [title, setTitle] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || "");
            setShortDescription(initialData.shortDescription || "");
            setContent(initialData.content || "");
        } else {
            setTitle("");
            setShortDescription("");
            setContent("");
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim() || !shortDescription.trim() || !content.trim()) {
            setError("All fields are required!");
            return;
        }
        onSave({
            id: initialData ? initialData.id : Date.now(),
            title,
            shortDescription,
            content,
            creationDate: initialData ? initialData.creationDate : new Date().toISOString(),
            isExpanded: initialData ? initialData.isExpanded : false,
        });
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h2>{initialData ? "Редагувати новину" : "Додати новину"}</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="title">Заголовок</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="shortDescription">Короткий опис</label>
                        <textarea
                            id="shortDescription"
                            value={shortDescription}
                            onChange={(e) => setShortDescription(e.target.value)}
                            rows="3"
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="content">Повний вміст </label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows="7"
                            required
                        />
                    </div>
                    <div className={styles.modalActions}>
                        <button
                            type="button"
                            className={`${styles.button} ${styles.secondaryButton}`}
                            onClick={onClose}
                        >
                            Скасувати
                        </button>
                        <button
                            type="submit"
                            className={`${styles.button} ${styles.primaryButton}`}
                        >
                            {initialData ? "Зберегти зміни" : "Додати новину"}
                        </button>
                    </div>
                </form>
            </div>
            <GlobalErrorDisplay message={error} onClose={() => setError(null)} />
        </div>
    );
};

export default NewsForm;