import axios from "axios";
import { Navigate, useLoaderData, useNavigate } from "react-router-dom";

export default function RandomThread() {
    const data = useLoaderData()
    const navigate = useNavigate();
    navigate('/thread/' + data);
}
export async function RandomThreadLoader() {
    const response = await axios.get('http://localhost:8080/api/thread/random');
    return response.data;
}