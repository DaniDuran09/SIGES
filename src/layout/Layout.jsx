import { Outlet } from "react-router-dom";
import SideBar from "./appLayout/SideBar.jsx";
import Header from "./appLayout/Header.jsx";

function Layout() {
    return (
        <div style={{ display: "flex", height: "100vh", backgroundColor: "#F9FAFC" }}>
            <SideBar />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: 'hidden' }}>
                <Header title="SIGES" />
                <main style={{ flex: 1, padding: 10, overflowY: 'auto' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default Layout;