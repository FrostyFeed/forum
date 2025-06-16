import React, { useState, useEffect } from "react";
import NewsItem from "./NewsItem";
import NewsForm from "./NewsForm";
import styles from "./NewsForum.module.css";
import Modal from "../modal";
import PostForm from "../reply_form";
import { is } from "date-fns/locale";
import axios from "axios";
import { useLoaderData } from "react-router-dom";
import DeleteConfirmation from "../DeleteConfirmation.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { Delete } from "lucide-react";
import { set } from "date-fns";



const NewsForum = () => {
    const data = useLoaderData()
    console.log("NewsForum data:", data);
    const { isAdmin } = useAuth();
    const [newsList, setNewsList] = useState(data.content || []);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingNews, setEditingNews] = useState(null);
    const [deleteNewsId, setDeleteNewsId] = useState(null);
    const [currentPageNumber, setCurrentPageNumber] = useState(data.pageNumber);
    const [hasNextPage, setHasNextPage] = useState(data.hasNext);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isDelteteModalOpen, setIsDeleteModalOpen] = useState(false);
    const openDeleteModal = (id) => {
        setIsDeleteModalOpen(true)
        setDeleteNewsId(id);
    };
    const closeDeleteModal = () => setIsDeleteModalOpen(false);
    const openModal = () => setIsFormOpen(true);
    const closeModal = () => setIsFormOpen(false);

    const handleLoadMore = async () => {
        const nextPageToFetch = currentPageNumber + 1

        if (isLoadingMore) return;
        if (!hasNextPage) return;


        setIsLoadingMore(true);
        try {
            const response = await axios.get(`http://localhost:8080/api/news?page=${nextPageToFetch}`);
            const newSliceData = response.data;

            const newItems = newSliceData.content;

            setNewsList(prevNewsList => [...prevNewsList, ...newItems]);

            setCurrentPageNumber(newSliceData.pageNumber ?? nextPageToFetch);
            setHasNextPage(newSliceData.hasNext ?? false);

        } catch (error) {

            setHasNextPage(false);

        } finally {
            setIsLoadingMore(false);
        }
    };
    const handleToggleExpand = (id) => {
        setNewsList(
            newsList.map((news) =>
                news.id === id ? { ...news, isExpanded: !news.isExpanded } : news
            )
        );
    };
    const handleDeleteModal = (id) => {
        setIsDeleteModalOpen(true);
        setDeleteNewsId(id);
    }

    const handleDeleteNews = () => {
        setNewsList(newsList.filter((news) => news.id !== deleteNewsId));
        setDeleteNewsId(null);
        closeDeleteModal();
    };

    const handleOpenForm = (newsItem = null) => {
        setEditingNews(newsItem);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingNews(null);
    };

    const handleSaveNews = (newsData, id) => {
        if (editingNews) {
            setNewsList(
                newsList.map((news) => (news.id === newsData.id ? newsData : news))
            );
        } else {
            setNewsList([{
                id: id,
                title: newsData.title,
                description: newsData.description,
                creationDate: newsData.creationDate,
                content: newsData.content,
                isExpanded: false,
            }, ...newsList]);
        }
        handleCloseForm();
    };

    return (
        <div className={styles.newsForumContainer}>
            <div className={styles.forumHeader}>
                <h1>Новини Форуму</h1>
                {isAdmin && (
                    <button
                        className={`${styles.button} ${styles.primaryButton}`}
                        onClick={() => handleOpenForm()}
                    >
                        Додати Новину
                    </button>

                )}
            </div>

            {newsList.length > 0 ? (
                <ul className={styles.newsList}>
                    {newsList.map((news) => (
                        <NewsItem
                            key={news.id}
                            news={news}
                            onToggleExpand={handleToggleExpand}
                            onEdit={() => handleOpenForm(news)}
                            onDelete={() => openDeleteModal(news.id)}
                        />
                    ))}
                </ul>
            ) : (
                <p style={{ textAlign: "center", color: styles["text-secondary"] }}>
                    Новин поки немає. Зайдіть пізніше!
                </p>
            )}
            {hasNextPage && (
                <div className={styles.loadMoreContainer}>
                    <button
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                        className={`${styles.button} ${styles.primaryButton}`}
                    >
                        {isLoadingMore ? "Завантаження..." : "Завантажити Більше Новин"}
                    </button>
                </div>
            )}
            <Modal isOpen={isFormOpen} onClose={closeModal}>
                <PostForm
                    formType="news"
                    onCancel={closeModal}
                    addNews={handleSaveNews}
                    redactedPost={editingNews}
                    isThread={false}
                    onSuccess={handleSaveNews}
                />
            </Modal>
            <Modal isOpen={isDelteteModalOpen} onClose={closeDeleteModal}>
                <DeleteConfirmation onCancel={closeDeleteModal} postId={deleteNewsId} onConfirm={handleDeleteNews} isNews={true}
                />
            </Modal>
        </div>
    );
};

export default NewsForum;
export async function NewsForumLoader() {
    const response = await axios.get('http://localhost:8080/api/news', {
        withCredentials: true
    });
    return response.data;
}