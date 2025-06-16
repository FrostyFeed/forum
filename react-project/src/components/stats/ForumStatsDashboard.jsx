import React, { useState, useEffect, useMemo } from 'react';
import { useLoaderData, useSearchParams } from 'react-router-dom';
import styles from './formStatsDashboard.module.css';
import LineGraph from './LineGraph';
import axios from 'axios';

const getCssVariableValue = (variableName, fallback) => {
    if (typeof window === 'undefined') {
        const fallbacks = {
            '--text-primary': '#e0e0e0',
            '--text-secondary': '#a0a0a0',
            '--accent': '#6200ee',
            '--accent-hover': '#7c4dff',
            '--border': '#333',
            '--bg-tertiary': '#2d2d2d',
        };
        return fallbacks[variableName] || fallback || '#000';
    }
    const value = getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
    return value || fallback || '#000';
};

export default function ForumStatsDashboard() {
    const { postStats, userStats, selectedYear: loadedYear, error: loaderError, reportStats, banStats } = useLoaderData();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isClient, setIsClient] = useState(false);
    const currentSelectedYear = searchParams.get('year') || loadedYear;

    useEffect(() => {
        setIsClient(true);
        if (!searchParams.get('year') && loadedYear) {
            setSearchParams({ year: loadedYear }, { replace: true });
        }
    }, [loadedYear, searchParams, setSearchParams]);

    const userStatsMonths = useMemo(() => userStats.map(item => item.month), [userStats]);
    const userStatsAmounts = useMemo(() => userStats.map(item => item.amount), [userStats]);

    const postStatsMonths = useMemo(() => postStats.map(item => item.month), [postStats]);
    const postStatsAmounts = useMemo(() => postStats.map(item => item.amount), [postStats]);
    const reportStatsMonths = useMemo(() => reportStats.map(item => item.month), [reportStats]);
    const reportStatsAmounts = useMemo(() => reportStats.map(item => item.amount), [reportStats]);

    const banStatsMonths = useMemo(() => banStats.map(item => item.month), [banStats]);
    const banStatsAmounts = useMemo(() => banStats.map(item => item.amount), [banStats]);
    const newReportsDataset = useMemo(() => {
        if (!isClient) return [];
        return [
            {
                label: 'Нові скарги',
                data: reportStatsAmounts,
                fill: true,
                borderColor: '#f44336',
                backgroundColor: '#f443364D',
                tension: 0.4,
                pointBackgroundColor: '#f44336',
                pointBorderColor: getCssVariableValue('--text-primary', '#e0e0e0'),
                pointHoverBackgroundColor: getCssVariableValue('--text-primary', '#e0e0e0'),
                pointHoverBorderColor: '#d32f2f',
            },
        ];
    }, [reportStatsAmounts, isClient]);

    const newBansDataset = useMemo(() => {
        if (!isClient) return [];
        return [
            {
                label: 'Нові бани',
                data: banStatsAmounts,
                fill: true,
                borderColor: '#ffc107',
                backgroundColor: '#ffc1074D',
                tension: 0.4,
                pointBackgroundColor: '#ffc107',
                pointBorderColor: getCssVariableValue('--text-primary', '#e0e0e0'),
                pointHoverBackgroundColor: getCssVariableValue('--text-primary', '#e0e0e0'),
                pointHoverBorderColor: '#ffa000',
            },
        ];
    }, [banStatsAmounts, isClient]);

    const newUsersDataset = useMemo(() => {
        if (!isClient) return [];
        return [
            {
                label: 'Нові користувачі',
                data: userStatsAmounts,
                fill: true,
                borderColor: getCssVariableValue('--accent', '#6200ee'),
                backgroundColor: `${getCssVariableValue('--accent', '#6200ee')}4D`,
                tension: 0.4,
                pointBackgroundColor: getCssVariableValue('--accent', '#6200ee'),
                pointBorderColor: getCssVariableValue('--text-primary', '#e0e0e0'),
                pointHoverBackgroundColor: getCssVariableValue('--text-primary', '#e0e0e0'),
                pointHoverBorderColor: getCssVariableValue('--accent-hover', '#7c4dff'),
            },
        ];
    }, [userStatsAmounts, isClient]);

    const newPostsDataset = useMemo(() => {
        if (!isClient) return [];
        return [
            {
                label: 'Нові дописи',
                data: postStatsAmounts,
                fill: true,
                borderColor: '#03dac5',
                backgroundColor: '#03dac54D',
                tension: 0.4,
                pointBackgroundColor: '#03dac5',
                pointBorderColor: getCssVariableValue('--text-primary', '#e0e0e0'),
                pointHoverBackgroundColor: getCssVariableValue('--text-primary', '#e0e0e0'),
                pointHoverBorderColor: '#3700b3',
            },
        ];
    }, [postStatsAmounts, isClient]);

    const appCurrentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 5 }, (_, i) => appCurrentYear - i);

    const handleYearChange = (event) => {
        const newYear = event.target.value;
        setSearchParams({ year: newYear });
    };

    if (loaderError) {
        return (
            <div className={styles.dashboardContainer}>
                <p className={styles.loadingText} style={{ color: 'red' }}>{loaderError}</p>
                <div className={styles.yearSelectorContainer}>
                    <label htmlFor="year-select" className={styles.yearSelectorLabel}>Оберіть рік:</label>
                    <select
                        id="year-select"
                        value={currentSelectedYear}
                        onChange={handleYearChange}
                        className={styles.yearSelector}
                    >
                        {yearOptions.map(year => (
                            <option key={year} value={year.toString()}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        );
    }

    const hasAnyData = userStats.length > 0 || postStats.length > 0 || reportStats.length > 0 || banStats.length > 0;

    if (!isClient && !hasAnyData) {
        return (
            <div className={styles.dashboardContainer}>
                <p className={styles.loadingText}>Завантаження даних інформаційної панелі...</p>
            </div>
        );
    }

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.controlsContainer}>
                <label htmlFor="year-select" className={styles.yearSelectorLabel}>Оберіть рік:</label>
                <select
                    id="year-select"
                    value={currentSelectedYear}
                    onChange={handleYearChange}
                    className={styles.yearSelector}
                    aria-label="Оберіть рік для статистики"
                >
                    {yearOptions.map(year => (
                        <option key={year} value={year.toString()}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>

            {hasAnyData ? (
                <>
                    <section className={styles.statsSection}>
                        <h2 className={styles.sectionTitle}>Активність нових користувачів</h2>
                        {isClient && userStatsMonths.length > 0 ? (
                            <LineGraph
                                titleText={`Нові користувачі за місяцями (${currentSelectedYear})`}
                                labels={userStatsMonths}
                                datasets={newUsersDataset}
                                containerClassName={styles.graphContainer}
                            />
                        ) : (
                            <p className={styles.noDataText}>Немає даних про користувачів за {currentSelectedYear}.</p>
                        )}
                    </section>

                    <section className={styles.statsSection}>
                        <h2 className={styles.sectionTitle}>Активність нових дописів</h2>
                        {isClient && postStatsMonths.length > 0 ? (
                            <LineGraph
                                titleText={`Нові дописи за місяцями (${currentSelectedYear})`}
                                labels={postStatsMonths}
                                datasets={newPostsDataset}
                                containerClassName={styles.graphContainer}
                            />
                        ) : (
                            <p className={styles.noDataText}>Немає даних про дописи за {currentSelectedYear}.</p>
                        )}
                    </section>
                    <section className={styles.statsSection}>
                        <h2 className={styles.sectionTitle}>Динаміка скарг</h2>
                        {isClient && reportStatsMonths.length > 0 ? (
                            <LineGraph
                                titleText={`Нові скарги за місяцями (${currentSelectedYear})`}
                                labels={reportStatsMonths}
                                datasets={newReportsDataset}
                                containerClassName={styles.graphContainer}
                            />
                        ) : (
                            <p className={styles.noDataText}>Немає даних про скарги за {currentSelectedYear}.</p>
                        )}
                    </section>

                    <section className={styles.statsSection}>
                        <h2 className={styles.sectionTitle}>Динаміка блокувань (банів)</h2>
                        {isClient && banStatsMonths.length > 0 ? (
                            <LineGraph
                                titleText={`Нові бани за місяцями (${currentSelectedYear})`}
                                labels={banStatsMonths}
                                datasets={newBansDataset}
                                containerClassName={styles.graphContainer}
                            />
                        ) : (
                            <p className={styles.noDataText}>Немає даних про бани за {currentSelectedYear}.</p>
                        )}
                    </section>
                </>
            ) : (
                isClient && <p className={styles.loadingText}>Немає даних за {currentSelectedYear}. Спробуйте обрати інший рік.</p>
            )}
        </div>
    );
}


export const StatsLoader = async ({ request }) => {
    const url = new URL(request.url);
    const year = url.searchParams.get("year") || new Date().getFullYear().toString();

    try {
        const [postsResponse, usersResponse, reportsResponse, bansResponse] = await Promise.all([
            axios.get(`http://localhost:8080/api/stats/posts?year=${year}`),
            axios.get(`http://localhost:8080/api/stats/users?year=${year}`),
            axios.get(`http://localhost:8080/api/stats?year=${year}&type=REPORT`),
            axios.get(`http://localhost:8080/api/stats?year=${year}&type=BAN`)
        ]);

        return {
            postStats: postsResponse.data || [],
            userStats: usersResponse.data || [],
            reportStats: reportsResponse.data || [],
            banStats: bansResponse.data || [],
            selectedYear: year
        };
    } catch (error) {
        console.error(`Failed to load stats for year ${year}:`, error);
        return {
            postStats: [],
            userStats: [],
            reportStats: [],
            banStats: [],
            selectedYear: year,
            error: "Не вдалося завантажити дані статистики."
        };
    }
};