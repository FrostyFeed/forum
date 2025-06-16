import styles from '../styles/thread.module.css';
import { Link } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext.jsx"
import DOMPurify from 'dompurify';
import { parseISO, format } from 'date-fns'
import { uk } from 'date-fns/locale';
import { useReply } from '../../context/ReplyContext.jsx';
import axios from 'axios';
import { useState } from 'react';
import { usePosts } from '../../context/PostsContext.jsx';
import { useEffect } from 'react';
import Reply from './reply.jsx';
export default function Post({ post, isMainPost, deleteReply }) {

    return (
        <>
            {post.map((postItem, index) => (
                <div key={postItem.id ?? index} className={styles.post}>
                    <Reply post={postItem} isMainPost={isMainPost ?? false} deleteReply={deleteReply} />
                </div>
            ))}
        </>
    );
}