import React, { useState } from 'react';
import styles from '../components/styles/verification.module.css';
import axios from 'axios';
import { useLoaderData, useParams } from 'react-router-dom';
const EmailVerification = () => {
    const email = useLoaderData()
    const { token } = useParams()
    const [isVerified, setIsVerified] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [message, setMessage] = useState('');
    const handleVerification = async () => {
        setIsVerifying(true);
        try {
            const response = await axios.post('http://localhost:8080/api/user/verification',
                { token },
                { headers: { 'Content-Type': 'application/json' } }
            );
            console.log(response);
            setIsVerified(true);
            setMessage(response.data);
        } catch (error) {
            if (error.response) {
                setMessage(`Перевірка не вдалася: ${error.response.data.token || 'Будь ласка, спробуйте пізніше'}`);
            } else if (error.request) {
                setMessage('Помилка мережі: Не вдалося підключитися до сервера');
            } else {
                setMessage('Помилка: Не вдалося надіслати запит на перевірку');
            }
            setIsVerified(true);
        } finally {
            setIsVerifying(false);
        }
    };


    return (
        <main className={styles.mainContent}>
            <div className={styles.verificationCard}>
                <div className={styles.cardIcon}>✉️</div>
                <h1 className={styles.cardTitle}>Підтвердьте Свою Електронну Пошту</h1>
                <p className={styles.cardText}>
                    Щоб активувати свій обліковий запис DarkForum, будь ласка, підтвердьте свою електронну адресу, натиснувши кнопку нижче.
                </p>

                <div className={styles.emailDisplay}>{email}</div>

                {!isVerified ? (
                    <button
                        onClick={handleVerification}
                        className={styles.verificationBtn}
                        disabled={isVerifying}
                    >
                        {isVerifying ? 'Підтвердження...' : 'Підтвердити Електронну Адресу'}
                    </button>
                ) : null}

                {isVerified && (
                    <div className={styles.successMessage}>
                        {message}
                    </div>
                )}
                {!isVerified && (
                    <>
                        <p className={styles.cardText}>
                            Не отримали електронного листа? Перевірте папку "Спам".
                        </p>
                    </>
                )}
            </div>
        </main>
    );
};

export default EmailVerification;
export async function EmailVerificationLoader({ params }) {
    const response = await axios.get(`http://localhost:8080/api/user/email/${params.token}`);
    return response.data;
}