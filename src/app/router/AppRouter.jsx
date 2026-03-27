import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";



import Login from "../../features/auth/screens/Login";
import Home from "../../features/home/screens/Home";
import Requests from "../../features/requests/screens/Requests";
import Spaces from "../../features/spaces/screens/Spaces";
import SpaceDetail from "../../features/spaces/screens/SpaceDetail";
import EditSpace from "../../features/spaces/screens/EditSpace";
import Equipment from "../../features/equipment/screens/Equipment";
import EquipmentDetail from "../../features/equipment/screens/EquipmentDetail";
import EditEquipment from "../../features/equipment/screens/EditEquipment";
import Users from "../../features/users/screens/Users";
import History from "../../features/history/screens/History";
import Configuration from "../../features/configuration/screens/Configuration";
import Layout from "../../layout/Layout.jsx";
import EquipmentHistory from "../../features/equipment/history/EquipmentHistory";
import ProtectedRoute from "../../routes/ProtectedRoute";
import PublicRoute from "../../routes/PublicRoute";
import EditProfile from "../../features/configuration/screens/EditProfile.jsx";
import Notifications from "../../features/configuration/screens/Notifications.jsx";
import AccountRecovery from "../../features/auth/screens/AccountRecovery.jsx";
import NewPassword from "../../features/auth/screens/NewPassword";
import UsedLinkError from "../../features/auth/screens/UsedLinkError";
import ExpiredLinkError from "../../features/auth/screens/ExpiredLinkError";

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/"
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Home />} />
                    <Route path="requests" element={<Requests />} />
                    <Route path="spaces" element={<Spaces />} />
                    <Route path="spaces/:id" element={<SpaceDetail />} />
                    <Route path="spaces/edit/:id" element={<EditSpace />} />
                    <Route path="equipment" element={<Equipment />} />
                    <Route path="equipment/:id" element={<EquipmentDetail />} />
                    <Route path="equipment/:id/history" element={<EquipmentHistory />} />
                    <Route path="equipment/edit/:id" element={<EditEquipment />} />
                    <Route path="users" element={<Users />} />
                    <Route path="history" element={<History />} />
                    <Route path="configuration" element={<Configuration />} />
                    <Route path="EditProfile" element={<EditProfile />} />
                    <Route path="Notificactions" element={<Notifications />} />
                </Route>

                <Route path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />

                <Route path="AccountRecovery" element={<AccountRecovery />} />
                <Route path="NewPassword" element={<NewPassword />} />
                <Route path="UsedLinkError" element={<UsedLinkError />} />
                <Route path="ExpiredLinkError" element={<ExpiredLinkError />} />
                <Route path="*" element={<Navigate to="/" />} />

            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;
