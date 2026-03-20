import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
    const { accessToken, role } = useAuth();

    if (!accessToken) {
        return children;
    }

    if (role !== "ADMIN") {
        return children;
    }

    return <Navigate to="/" replace />;
};

export default PublicRoute;