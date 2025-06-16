import React, { useState } from 'react';
import axios from 'axios';
import { z } from 'zod';
import styles from './ReportForm.module.css';

const reportSchema = z.object({
    reason: z.string()
        .min(4, { message: "Причина повинна містити щонайменше 4 символи." })
        .max(500, { message: "Причина не може перевищувати 500 символів." }),
});


const ReportReasonForm = ({ isMainPost, id, onClose }) => {
    const [reason, setReason] = useState('');
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isReportedSuccessfully, setIsReportedSuccessfully] = useState(false);
    const postId = id;

    const reportTitle = "Подати скаргу";
    const fieldLabel = "Причина скарги:";
    const placeholderText = "Введіть причину тут...";
    const submitButtonText = "Подати скаргу";

    const handleInputChange = (e) => {
        setReason(e.target.value);
        if (error) setError(null);
        if (successMessage) setSuccessMessage(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccessMessage(null);

        const result = reportSchema.safeParse({ reason });

        if (!result.success) {
            const fieldErrors = result.error.formErrors.fieldErrors;
            if (fieldErrors.reason && fieldErrors.reason[0]) {
                setError(fieldErrors.reason[0]);
            } else {
                setError("Виникла неочікувана помилка валідації.");
                return;
            }
            setIsSubmitting(false);
            return;
        }

        try {

            axios.post('http://localhost:8080/api/reports', {
                reason: result.data.reason,
                type: isMainPost ? 'thread' : 'reply',
                postId: postId
            }, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                }
            })
            setSuccessMessage(`Звіт успішно надіслано!`);
            setReason('');
            setIsReportedSuccessfully(true);
            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (apiError) {
            console.error("Помилка надсилання (симульована):", apiError);
            setError("Не вдалося надіслати звіт. Будь ласка, спробуйте ще раз.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.reportFormContainer}>
            <h2>{reportTitle}</h2>
            <form onSubmit={handleSubmit} noValidate>
                <div className={styles.reportFormField}>
                    <label htmlFor="report-reason">{fieldLabel}</label>
                    <input
                        type="text"
                        id="report-reason"
                        name="reason"
                        value={reason}
                        disabled={isSubmitting || isReportedSuccessfully}
                        onChange={handleInputChange}
                        placeholder={placeholderText}
                        className={`${styles.formInput} ${error ? styles.inputError : ''}`}
                        aria-invalid={!!error}
                        aria-describedby={error ? "reason-error-message" : undefined}
                    />
                    {error && <p id="reason-error-message" className={styles.errorMessage}>{error}</p>}
                </div>
                <button
                    type="submit"
                    className={styles.reportFormButton}
                    disabled={isSubmitting || isReportedSuccessfully}
                >
                    {isSubmitting ? 'Надсилання...' : submitButtonText}
                </button>
                {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
            </form>
        </div>
    );
};

export default ReportReasonForm;