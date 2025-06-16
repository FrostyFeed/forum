import ReportDisplay from './ReportDisplay.jsx';
import React, { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import axios from 'axios';
function AdminDashboard() {
    const initialData = useLoaderData();

    const [reports, setReports] = useState(initialData.reports.content || []);

    const [currentIndex, setCurrentIndex] = useState(0);

    const [hasNextPage, setHasNextPage] = useState(initialData.reports.hasNext);

    const [nextPageToFetch, setNextPageToFetch] = useState(1);

    const [isLoading, setIsLoading] = useState(false);



    const handleNextReport = async () => {
        const isNextReportLoaded = currentIndex < reports.length - 1;

        if (isNextReportLoaded) {
            setCurrentIndex(prevIndex => prevIndex + 1);
        } else if (hasNextPage && !isLoading) {
            setIsLoading(true);
            try {
                const response = await axios.get(`http://localhost:8080/api/reports?page=${nextPageToFetch}`, {
                    withCredentials: true
                });

                setReports(prevReports => [...prevReports, ...response.data.content]);

                setHasNextPage(response.data.hasNext);
                setNextPageToFetch(prevPage => prevPage + 1);
                setCurrentIndex(prevIndex => prevIndex + 1);
            } catch (error) {
                console.error('Error fetching next report:', error);
            } finally {
                setIsLoading(false);
            }
        } else {
            console.log('No more reports to display.');
        }
    };

    const handlePreviousReport = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prevIndex => prevIndex - 1);
        }
    };
    const handleReportReviewed = async () => {
        if (isLoading || reports.length === 0) return;

        const reportToRemove = reports[currentIndex];
        if (!reportToRemove) return;

        try {
            console.log(`Report ${reportToRemove.id} marked as reviewed.`);
        } catch (error) {
            console.error('Failed to update report status on server:', error);
            return;
        }

        const newReports = reports.filter((_, index) => index !== currentIndex);
        setReports(newReports);

        if (currentIndex >= newReports.length && newReports.length > 0) {
            setCurrentIndex(newReports.length - 1);
        }
    };




    return (
        <div>
            <ReportDisplay
                reportData={reports[currentIndex]}
                totalReports={reports.length}
                isLoading={isLoading}
                hasPrevious={currentIndex > 0}
                hasNextPage={currentIndex < reports.length - 1 || hasNextPage}
                loadNextReport={handleNextReport}
                loadPreviousReport={handlePreviousReport}
                onReportReviewed={handleReportReviewed}
            />
        </div>
    );
}

export default AdminDashboard;
export async function ReportsLoader() {
    const response = await axios.get(`http://localhost:8080/api/reports?page=0`, {
        withCredentials: true
    })
    const data = {
        reports: response.data
    }
    return data
}