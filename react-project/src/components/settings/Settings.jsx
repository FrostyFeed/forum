import { useState, useEffect } from "react";
import { z } from "zod";
import axios from "axios";
import styles from "./styles/settings.module.css";
import NicknameSection from "./NicknameSection";
import AvatarSection from "./AvatarSection";
import PasswordSection from "./PasswordSection";
import DeleteAccountSection from "./DeleteAccountSection";
import { useAuth } from "../../context/AuthContext";
export default function Settings() {
    const [serverError, setServerError] = useState(null);
    const { user, setUser } = useAuth();
    console.log(user)


    return (
        <main className={styles.mainContent}>
            <div className={styles.centerContainer}>
                <div className={styles.settingsContainer}>
                    <h2 className={styles.settingsTitle}>Налаштування акаунту</h2>
                    {serverError && (
                        <div className={styles.serverError}>
                            {serverError}
                        </div>
                    )}

                    <div className={styles.settingsContent}>
                        <NicknameSection
                            user={user}
                            setGlobalUserData={setUser}
                            setServerError={setServerError}
                        />
                        <hr className={styles.sectionDivider} />
                        <AvatarSection
                            user={user}
                            setGlobalUserData={setUser}
                            setServerError={setServerError}
                        />
                        <hr className={styles.sectionDivider} />
                        <PasswordSection
                            userEmail={user.email}
                            setServerError={setServerError}
                        />
                        <hr className={styles.sectionDivider} />
                        <DeleteAccountSection
                            setServerError={setServerError}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}