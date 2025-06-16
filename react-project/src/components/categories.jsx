import React, { useState } from 'react';
import styles from './styles/categories.module.css';
import globalStyles from './styles/global.module.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'
import Modal from './modal.jsx';
import axios from 'axios';
const EditIcon = () => <span title="Edit" aria-label="Edit category">✎</span>;
const DeleteIcon = () => <span title="Delete" aria-label="Delete category">🗑️</span>;
export default function Categories({ topicss }) {
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [topics, setTopics] = useState(topicss)
    const [editingCategory, setEditingCategory] = useState(null);
    const handleCreateCategoryClick = () => {
        setEditingCategory(null);
        setTitle('');
        setDescription('');
        setIsModalOpen(true);
    };

    const handleEditCategoryClick = (category) => {
        setEditingCategory(category);
        setTitle(category.tittle);
        setDescription(category.description);
        setIsModalOpen(true);
        console.log("Edit category clicked:", category);
    };

    const handleDeleteCategoryClick = (categoryId) => {
        if (window.confirm(`Are you sure you want to delete this category (ID: ${categoryId})? This action cannot be undone.`)) {
            console.log("Delete category confirmed:", categoryId);
            axios.delete(`http://localhost:8080/api/topic/${categoryId}`, { headers: { 'Content-Type': 'application/json' }, withCredentials: true }).then((response) => {
                if (response.status === 200) {
                    const updatedTopics = topics.filter(topic => topic.id !== categoryId);
                    setTopics(updatedTopics);
                }
            })
        } else {
            console.log("Delete category cancelled:", categoryId);
        }
    };


    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
        setTitle('');
        setDescription('');
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        const categoryData = { description, title };

        if (editingCategory) {
            console.log("Updating category:", editingCategory.id, categoryData);
            axios.put(`http://localhost:8080/api/topic`, {
                id: editingCategory.id,
                ...categoryData
            }, { headers: { 'Content-Type': 'application/json' }, withCredentials: true }).then((response) => {
                if (response.status === 200) {
                    const updatedTopics = topics.map(topic => topic.id === editingCategory.id ? { id: topic.id, description: categoryData.description, tittle: categoryData.title } : topic);
                    setTopics(updatedTopics);
                }
            })
        } else {
            console.log("Creating category with:", categoryData);
            const response = axios.post('http://localhost:8080/api/topic', {
                title: title,
                desc: description
            }, { headers: { 'Content-Type': 'application/json' }, withCredentials: true }).then((response) => {
                if (response.status === 200) {
                    const newTopic = { id: response.data.topicId, tittle: title, description: description, threadsCount: 0 }
                    setTopics([...topics, newTopic])
                }
            });
        }
        handleCloseModal();
    };



    const isAdmin = user?.roles?.includes('ROLE_Admin');
    return (
        <>
            <section className={styles.topicsSection}>
                <div className={styles.sectionHeader}>
                    <h2 className={`${globalStyles.sectionTitle} ${styles.sectionTitleGrow}`}>
                        Теми
                    </h2>
                    {isAdmin && (
                        <button
                            className={styles.createButton}
                            onClick={handleCreateCategoryClick}
                        >
                            <span className={styles.plusIcon}></span>
                            Створити тему
                        </button>
                    )}
                </div>
                <div className={styles.topicGrid}>
                    {topics.map((topic) => (
                        <div key={topic.id} className={styles.topicCard}>
                            {isAdmin && (
                                <div className={styles.cardActions}>
                                    <button
                                        onClick={() => handleEditCategoryClick(topic)}
                                        className={`${styles.actionButton} ${styles.editButton}`}
                                    >
                                        <EditIcon />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteCategoryClick(topic.id)}
                                        className={`${styles.actionButton} ${styles.deleteButton}`}
                                    >
                                        <DeleteIcon />
                                    </button>
                                </div>
                            )}
                            <h3><Link to={`/topic/${topic.id}`}>{topic.tittle}</Link></h3>
                            <p>{topic.description}</p>
                            <div className={styles.topicStats}>
                                <div>Пости: {topic.threadsCount?.toLocaleString() ?? 0}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <div className={styles.modalContainer}>
                    <button className={styles.modalCloseButton} onClick={handleCloseModal}>
                    </button>
                    <h2 className={styles.modalHeading}>
                        {editingCategory ? 'Редагувати тему' : 'Створити тему'}
                    </h2>
                    <form onSubmit={handleFormSubmit}>
                        <div className={styles.formGroup}>
                            <label htmlFor="categoryTitle">Заголовок</label>
                            <input
                                type="text"
                                id="categoryTitle"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className={styles.formInput}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="categoryDescription">Опис</label>
                            <textarea
                                id="categoryDescription"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows="4"
                                required
                                className={styles.formTextarea}
                            />
                        </div>
                        <button type="submit" className={styles.formSubmitButton}>
                            {editingCategory ? 'Оновити тему' : 'Створити тему'}
                        </button>
                    </form>
                </div>
            </Modal>
        </>
    )
}

