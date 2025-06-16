// RuleForm.js
import React, { useState, useEffect } from 'react';
import styles from './RulesDisplay.module.css';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext.jsx';

function RuleForm({ initialRule = { id: null, text: '' }, onSave, onCancel, formType }) {
    const [text, setText] = useState(initialRule.text);
    const { isAdmin } = useAuth();

    useEffect(() => {
        setText(initialRule.text);
    }, [initialRule.text]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim()) {
            onSave({ ...initialRule, text: text.trim() });
        }
    };

    return (
        <div className={styles.modalContent}>
            {isAdmin && (
                <h3>{formType === 'add' ? 'Додати нове правило' : 'Редагувати правило'}</h3>
            )}
            <form onSubmit={handleSubmit} className={styles.modalForm}>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Введіть опис правила..."
                    rows="5"
                    required
                    autoFocus
                />
                <div className={styles.modalActions}>
                    <button type="button" onClick={onCancel} className={styles.cancelButton}>
                        Скасувати
                    </button>
                    <button type="submit" className={styles.saveButton}>
                        {formType === 'add' ? 'Додати правило' : 'Зберегти зміни'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default RuleForm;