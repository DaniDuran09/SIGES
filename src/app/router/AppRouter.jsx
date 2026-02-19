import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";



import Login from "../../features/auth/screens/Login";
import Home from "../../features/home/screens/Home";
import Requests from "../../features/requests/screens/Requests";
import Spaces from "../../features/spaces/screens/Spaces";
import Equipment from "../../features/equipment/screens/Equipment";
import Users from "../../features/users/screens/Users";
import History from "../../features/history/screens/History";
import Configuration from "../../features/configuration/screens/Configuration";
import Layout from "../../layout/Layout.jsx";

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/login" element={<Login />} />

                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="requests" element={<Requests />} />
                    <Route path="spaces" element={<Spaces />} />
                    <Route path="equipment" element={<Equipment />} />
                    <Route path="users" element={<Users />} />
                    <Route path="history" element={<History />} />
                    <Route path="configuration" element={<Configuration />} />
                </Route>

                <Route path="*" element={<Navigate to="/" />} />

            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;
