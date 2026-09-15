import useMarketData from "../context/useMarketData";

/**
 * Live list of all stocks + connection status.
 * Usage: const { stockList, isConnected } = useStocks();
 */
export default function useStocks() {
  const { stockList, isConnected, isLoading, error } = useMarketData();
  return { stocks: stockList, isConnected, isLoading, error };
}
