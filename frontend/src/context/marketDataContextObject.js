import { createContext } from "react";

// Kept in its own file (separate from the provider component and the hook)
// purely so Vite/React Fast Refresh can reliably hot-reload the provider.
export const MarketDataContext = createContext(null);
