import './App.css'
import AppRouter from "./app/router/AppRouter";
import { useNotifications } from "./hooks/useNotifications";

function App() {
    const { requestPermission } = useNotifications();
    return (
        <>
            <button onClick={requestPermission}>Token</button>
            <AppRouter />
        </>
    );
}

export default App;
