import { Outlet } from "react-router-dom"
import Header from "./header.jsx"
import Footer from "./footer.jsx"
import SideMenu from "./sideMenu/SideMenu.jsx"
import ScrollToTop from "./ScrollToTop.jsx"
export default function RootLayout() {
    return (
        <>
            <ScrollToTop />
            <Header />
            <Outlet />
            <Footer />
        </>
    )
}