import './App.css'
import AppRouter from "./app/router/AppRouter";
import { useNotifications } from "./context/NotificationContext";
import { useEffect } from "react";

function App() {
    const { getFCMToken } = useNotifications();

    useEffect(() => {
        getFCMToken();
    }, [getFCMToken]);

    return (
        <>
            <AppRouter />
        </>
    );
}

export default App;

// example of how to use the useMediaQuery hook
// import { useMediaQuery } from "./hooks/useMediaQuery";
// const matches = useMediaQuery("(max-width: 768px)");
// console.log(matches);