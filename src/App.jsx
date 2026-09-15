import AppRoutes from "./routes/AppRoutes";
import { MarketDataProvider } from "./context/MarketDataContext";

function App() {
    return (
        <MarketDataProvider>
            <AppRoutes />
        </MarketDataProvider>
    );
}

export default App;