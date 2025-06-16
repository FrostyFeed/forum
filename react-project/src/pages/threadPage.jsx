import axios from 'axios'
import Thread from '../components/thread.jsx'
import { useLoaderData } from 'react-router-dom'
import { ThreadProvider } from '../context/ThreadContext.jsx'
import { PostsProvider } from '../context/PostsContext.jsx'
export default function ThreadPage() {
    const data = useLoaderData()
    return (
        <ThreadProvider>
            <Thread thread={data.thread} replies={data.replies} />
        </ThreadProvider>
    )
}
export async function ThreadPageLoader({ params }) {
    const response = await axios.get(`http://localhost:8080/api/thread/${params.threadId}`)
    const response2 = await axios.get(`http://localhost:8080/api/replies/${params.threadId}`)
    const data = {
        thread: response.data,
        replies: response2.data
    }
    return data
}