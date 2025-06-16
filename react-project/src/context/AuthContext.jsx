import axios from "axios";
import UserBanInfo from "../components/banInfo/UserBanInfo";
import React, { createContext, use, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [banDetails, setBanDetails] = useState(null)
    const [showBanInfo, setShowBanInfo] = useState(true);
    useEffect(() => {
        const fetchUser = async () => {
            const rememberMe = localStorage.getItem('rememberMe') === "true";
            if (
                rememberMe
            ) {
                try {
                    const response = await axios.get(
                        "http://localhost:8080/api/auth/me",
                        {
                            withCredentials: true,
                        }
                    );
                    setUser(response.data);
                } catch (err) {
                    setUser(null);
                    if (err.response.data.errorCode === "USER_BANNED") {
                        setBanDetails(err.response.data);
                    }

                }
            }
        };

        fetchUser();
    }, []);
    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
        localStorage.setItem("rememberMe", "false");
    };
    const isAdmin = user?.roles.includes('ROLE_Admin');


    return (
        <AuthContext.Provider value={{ user, login, logout, setUser, banDetails, showBanInfo, setShowBanInfo, setBanDetails, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
