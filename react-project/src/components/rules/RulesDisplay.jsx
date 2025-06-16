import React, { useState, useEffect } from 'react';
import styles from './RulesDisplay.module.css';
import Modal from '../modal.jsx';
import RuleForm from './RuleForm.jsx';
import { useLoaderData } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext.jsx';


function RulesDisplay() {
    const data = useLoaderData();
    const { user } = useAuth()
    const isAdmin = user?.roles.includes('ROLE_Admin');
    const [rules, setRules] = useState(data);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentRuleToEdit, setCurrentRuleToEdit] = useState(null);


    const openAddModal = () => setIsAddModalOpen(true);
    const closeAddModal = () => setIsAddModalOpen(false);

    const openEditModal = (rule) => {
        setCurrentRuleToEdit(rule);
        setIsEditModalOpen(true);
    };
    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setCurrentRuleToEdit(null);
    };

    const handleAddRule = async (newRuleData) => {
        await axios.post('http://localhost:8080/api/rules', {
            adminId: user.id,
            text: newRuleData.text,
        }, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        }).then((response) => {
            console.log('Rule added:', response.data);
            const newRule = {
                ...newRuleData,
                id: response.data,
            };
            setRules((prevRules) => [...prevRules, newRule]);
            closeAddModal();
        })
    };

    const handleEditRule = async (updatedRuleData) => {
        await axios.patch(`http://localhost:8080/api/rules`, {
            text: updatedRuleData.text,
            id: updatedRuleData.id,
        }, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        }).then((response) => {
            console.log('Rule updated:', response.data);
            setRules((prevRules) =>
                prevRules.map((rule) =>
                    rule.id === updatedRuleData.id ? updatedRuleData : rule
                )
            );
            closeEditModal();
        })
    };

    const handleDeleteRule = async (ruleId) => {
        if (window.confirm('Are you sure you want to delete this rule?')) {
            await axios.delete(`http://localhost:8080/api/rules/${ruleId}`, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            }).then((response) => {
                setRules((prevRules) => prevRules.filter((rule) => rule.id !== ruleId));
            })
        }
    };

    return (
        <div className={styles.rulesContainer}>
            <h2>Правила форуму</h2>
            {isAdmin && (
                <button onClick={openAddModal} className={styles.addNewButton}>
                    Додати нове правило
                </button>
            )}

            {rules.length > 0 ? (
                <ul className={styles.rulesList}>
                    {rules.map((rule) => (
                        <li key={rule.id} className={styles.ruleItem}>
                            <span className={styles.ruleText}>{rule.text}</span>
                            {isAdmin && (
                                <div className={styles.ruleActions}>
                                    <button
                                        onClick={() => openEditModal(rule)}
                                        className={styles.editButton}
                                        aria-label={`Редагувати правило: ${rule.text}`}
                                    >
                                        Редагувати
                                    </button>
                                    <button
                                        onClick={() => handleDeleteRule(rule.id)}
                                        className={styles.deleteButton}
                                        aria-label={`Видалити правило: ${rule.text}`}
                                    >
                                        Видалити
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Наразі правила не визначені.</p>
            )}

            <Modal isOpen={isAddModalOpen} onClose={closeAddModal}>
                <RuleForm
                    formType="add"
                    onSave={handleAddRule}
                    onCancel={closeAddModal}
                />
            </Modal>

            {currentRuleToEdit && (
                <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
                    <RuleForm
                        formType="edit"
                        initialRule={currentRuleToEdit}
                        onSave={handleEditRule}
                        onCancel={closeEditModal}
                    />
                </Modal>
            )}
        </div>
    );
}

export default RulesDisplay;
export async function RulesLoader() {
    const response = await axios.get('http://localhost:8080/api/rules');
    return response.data;
}