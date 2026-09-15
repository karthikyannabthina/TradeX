import { useContext } from "react";
import { MarketDataContext } from "./marketDataContextObject";

export default function useMarketData() {
  const ctx = useContext(MarketDataContext);
  if (!ctx) {
    throw new Error("useMarketData must be used within a MarketDataProvider");
  }
  return ctx;
}
