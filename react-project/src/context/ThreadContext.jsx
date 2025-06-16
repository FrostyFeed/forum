
import axios from "axios";
import React, { createContext, use, useContext, useEffect, useState } from "react";

const ThreadContext = createContext();

export const ThreadProvider = ({ children }) => {
    const [content, setContent] = useState('')


    return (
        <ThreadContext.Provider value={{ content, setContent }}>
            {children}
        </ThreadContext.Provider>
    );
};

export const useThread = () => {
    return useContext(ThreadContext);
};