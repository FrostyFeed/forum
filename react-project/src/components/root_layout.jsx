import { Outlet } from "react-router-dom"
import Header from "./header.jsx"
import Footer from "./footer.jsx"
export default function RootLayout() {
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    )
}