import { useLoaderData } from 'react-router-dom'
import axios from 'axios'
import User from '../components/user/user.jsx'
export default function UserPage() {
    const data = useLoaderData()
    return (
        <User data={data} />
    )
}
export async function UserPageLoader({ params }) {
    const promises = [
        axios.get(`http://localhost:8080/api/user/${params.userId}/latest`),
        axios.get(`http://localhost:8080/api/user/${params.userId}`)
    ];

    try {

        const [latestActivityResponse, userResponse] = await Promise.all(promises);


        return {
            latest: latestActivityResponse.data,
            user: userResponse.data,
        };

    } catch (error) {
        console.error("Failed to load user data:", error);
        throw new Response("Not Found", { status: 404 });
    }
}