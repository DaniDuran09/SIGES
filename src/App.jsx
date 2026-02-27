import './App.css'
import AppRouter from "./app/router/AppRouter";
import { useNotifications } from "./hooks/useNotifications";

function App() {
    const { requestPermission } = useNotifications();
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