import { useState } from 'react';
import styles from './styles/navigation.module.css'
import axios from 'axios';
export default function Navigation({ pageDate, setActivePage, activePage }) {
    const handleNextPage = () => {
        if (activePage >= pageDate.totalPages) return;
        else {
            setActivePage(activePage + 1)
        }
    }
    const handlePageChange = (page) => {
        setActivePage(page);
    }
    const isLastPage = activePage >= pageDate.totalPages;
    return (
        <div className={styles.pagination}>
            {Array.from({ length: pageDate.totalPages }, (_, i) => {
                return (
                    <button
                        key={i + 1}
                        type="button"
                        onClick={() => handlePageChange(i + 1)}
                        aria-label={`Go to page ${i + 1}`}
                        className={i === activePage - 1 ? styles.active : ''}
                    >
                        {i + 1}
                    </button>
                );
            })}
            <button
                type="button"
                onClick={handleNextPage}
                aria-label="Next page"
                hidden={isLastPage}
            >
                Next »
            </button>
        </div>
    )
}