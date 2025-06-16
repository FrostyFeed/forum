import { useParams } from "react-router-dom"
import SetNewPassword from "../components/resetPassword/ResetPassword"
export default function PasswordResetPage() {
    const { token } = useParams()
    return (
        <>
            <SetNewPassword token={token} />
        </>
    )
}