import React, { useState, useEffect, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

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


export default function LineGraph({
    titleText,
    labels,
    datasets,
    height = '400px',
    containerClassName = '',
    customOptions = {},
    loadingText = 'Завантаження діаграми...', }) {
    const [cssVarsLoaded, setCssVarsLoaded] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const timer = setTimeout(() => {
                setCssVarsLoaded(true);
            }, 50);
            return () => clearTimeout(timer);
        } else {
            setCssVarsLoaded(true);
        }
    }, []);

    const chartData = useMemo(() => ({
        labels: labels,
        datasets: datasets,
    }), [labels, datasets]);

    const defaultChartOptions = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: getCssVariableValue('--text-primary', '#e0e0e0'),
                    font: { size: 14 },
                    padding: 20,
                },
            },
            tooltip: {
                backgroundColor: getCssVariableValue('--bg-tertiary', '#2d2d2d'),
                titleColor: getCssVariableValue('--text-primary', '#e0e0e0'),
                bodyColor: getCssVariableValue('--text-secondary', '#a0a0a0'),
                borderColor: getCssVariableValue('--border', '#333'),
                borderWidth: 1,
                padding: 10,
                cornerRadius: 4,
                boxPadding: 5,
            },
            title: {
                display: true,
                text: titleText,
                color: getCssVariableValue('--text-primary', '#e0e0e0'),
                font: { size: 18, weight: 'bold' },
                padding: { top: 10, bottom: 20 },
            },
        },
        scales: {
            x: {
                ticks: {
                    color: getCssVariableValue('--text-secondary', '#a0a0a0'),
                    font: { size: 12 },
                },
                grid: {
                    color: `${getCssVariableValue('--border', '#333')}80`, // 50% opacity
                    borderColor: getCssVariableValue('--border', '#333'),
                },
            },
            y: {
                ticks: {
                    color: getCssVariableValue('--text-secondary', '#a0a0a0'),
                    font: { size: 12 },
                    beginAtZero: true,
                    padding: 10,
                },
                grid: {
                    color: `${getCssVariableValue('--border', '#333')}80`,
                    borderColor: getCssVariableValue('--border', '#333'),
                },
            },
        },
    }), [cssVarsLoaded, titleText]);

    const chartOptions = useMemo(() => {
        return {
            ...defaultChartOptions,
            ...customOptions,
            plugins: {
                ...defaultChartOptions.plugins,
                ...(customOptions.plugins || {}),
                title: {
                    ...defaultChartOptions.plugins.title,
                    ...(customOptions.plugins?.title || {}),
                    text: titleText,
                },
                legend: {
                    ...defaultChartOptions.plugins.legend,
                    ...(customOptions.plugins?.legend || {}),
                },
                tooltip: {
                    ...defaultChartOptions.plugins.tooltip,
                    ...(customOptions.plugins?.tooltip || {}),
                },
            },
            scales: {
                x: {
                    ...defaultChartOptions.scales.x,
                    ...(customOptions.scales?.x || {}),
                },
                y: {
                    ...defaultChartOptions.scales.y,
                    ...(customOptions.scales?.y || {}),
                },
            }
        };
    }, [defaultChartOptions, customOptions, titleText]);


    if (!cssVarsLoaded && typeof window !== 'undefined') {
        return <p style={{ color: getCssVariableValue('--text-primary', '#e0e0e0') }}>{loadingText}</p>;
    }

    return (
        <div
            style={{ height: height, position: 'relative' }}
            className={containerClassName}
        >
            <Line options={chartOptions} data={chartData} />
        </div>
    );
}