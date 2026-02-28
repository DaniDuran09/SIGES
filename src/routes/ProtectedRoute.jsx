import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
    const { accessToken, role } = useAuth();
    console.log(accessToken, role);

    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    if (role === "ADMIN") {
        console.log("ADMIN");
        return children;
    }


    return <Navigate to="/login" replace />;
};

export default ProtectedRoute;