import useMarketData from "../../context/useMarketData";
import {
  formatCurrency,
  formatPercent,
} from "../../utils/formatCurrency";
import "./Watchlist.css";

const DEFAULT_SYMBOLS = [
  "TCS",
  "INFY",
  "RELIANCE",
  "HDFCBANK",
];

export default function Watchlist({
  symbols = DEFAULT_SYMBOLS,
}) {
  const {
    getStock,
    isLoading,
  } = useMarketData();

  const watchedStocks = symbols
    .map((symbol) => getStock(symbol))
    .filter(Boolean);

  if (isLoading && watchedStocks.length === 0) {
    return (
      <div className="watchlist">
        <p className="watchlist__empty">
          Loading prices...
        </p>
      </div>
    );
  }

  if (!isLoading && watchedStocks.length === 0) {
    return (
      <div className="watchlist">
        <p className="watchlist__empty">
          No market data available.
        </p>
      </div>
    );
  }

  return (
    <div className="watchlist">
      {watchedStocks.map((stock) => {
        const symbol =
          stock.symbol?.toUpperCase() || "";

        const price = Number(
          stock.price ??
            stock.ltp ??
            stock.currentPrice ??
            0
        );

        const changePercent = Number(
          stock.changePercent ?? 0
        );

        const isPositive = changePercent >= 0;

        return (
          <div
            className="stock"
            key={symbol}
          >
            <div className="stock__symbol">
              <strong>{symbol}</strong>
            </div>

            <div className="stock__price">
              <p>
                {formatCurrency(price)}
              </p>

              <span
                className={
                  isPositive
                    ? "green"
                    : "red"
                }
              >
                {formatPercent(changePercent)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}