
import React, { createContext, use, useContext, useEffect, useState } from "react";
import PostReply from '../components/postReference.jsx'

const PostsContext = createContext();

export const PostsProvider = ({ children }) => {
    const [posts, setPosts] = useState([])


    return (
        <PostsContext.Provider value={{ posts, setPosts, }}>
            {children}
        </PostsContext.Provider>
    );
};

export const usePosts = () => {
    return useContext(PostsContext);
};
