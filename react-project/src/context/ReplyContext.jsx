
import axios from "axios";
import React, { createContext, use, useContext, useEffect, useState } from "react";
import PostReply from '../components/postReference.jsx'

const ReplyContext = createContext();

export const ReplyProvider = ({ children }) => {
    const [content, setContent] = useState(null)

    function addReference() {
        setContent((prevContent) => {
            const newHtml = prevContent + ``;
            console.log("Setting new HTML:", newHtml);
            return newHtml;
        });
        console.log(content)

    }

    return (
        <ReplyContext.Provider value={{ content, setContent, addReference }}>
            {children}
        </ReplyContext.Provider>
    );
};

export const useReply = () => {
    return useContext(ReplyContext);
};
