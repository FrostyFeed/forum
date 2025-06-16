import { useState } from 'react';
import { X } from 'lucide-react';
import styles from './styles/PostReference.module.css';

const PostReference = ({
    username = "user123",
    content = "This is the original post that the user is replying to...",
    date = "May 8, 2025"
}) => {
    const [isVisible, setIsVisible] = useState(true);

    const truncateContent = (text, maxLength = 100) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    };

    const handleRemove = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className={styles.referenceContainer}>
            <div className={styles.contentWrapper}>
                <div className={styles.textContent}>
                    <div className={styles.userInfoLine}>
                        <span className={styles.username}>{username}</span>
                        <span className={styles.separator}>•</span>
                        <span className={styles.date}>{date}</span>
                    </div>
                    <p className={styles.postContent}>{truncateContent(content)}</p>
                </div>
                <button
                    onClick={handleRemove}
                    className={styles.removeButton}
                    aria-label="Remove reference"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};

export default PostReference;