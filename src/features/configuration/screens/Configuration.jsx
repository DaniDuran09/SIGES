import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Configuration() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    }
    return (
        <h1>
            Configuration
            <button onClick={handleLogout} >Logout</button>

        </h1>
    )
}
export default Configuration;