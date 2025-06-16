import { useLoaderData } from 'react-router-dom';
import Categories from '../components/categories.jsx';
import Latest_threads from '../components/latest_threads.jsx';
import styles from '../components/styles/global.module.css'
import axios from 'axios';
export default function Main() {
    const data = useLoaderData()
    return (
        <main className={`${styles.container} ${styles.mainContent}`}>
            <Categories topicss={data.topics} />
            <Latest_threads threads={data.threads} />
        </main>
    )
}
export async function MainPageLoader() {
    const response = await axios.get(`http://localhost:8080/api/topics`)
    const response2 = await axios.get(`http://localhost:8080/api/thread/latest`)
    const data = {
        topics: response.data,
        threads: response2.data
    }
    return data
}