import { Outlet } from "react-router-dom";
import SideBar from "./appLayout/SideBar.jsx";

function Layout() {
    return (
        <div style={{ display: "flex", height: "100vh", overflow: 'hidden' }}>
            <SideBar />

            <main style={{ flex: 1, padding: 20, overflowY: 'auto' }}>
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;