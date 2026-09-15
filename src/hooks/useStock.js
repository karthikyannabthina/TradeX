import useMarketData from "../context/useMarketData";

/**
 * Live data for a single symbol, updated in real time via the shared socket.
 * Usage: const stock = useStock("RELIANCE");
 */
export default function useStock(symbol) {
  const { getStock, isConnected } = useMarketData();
  const stock = symbol ? getStock(symbol) : null;
  return { stock, isConnected };
}
