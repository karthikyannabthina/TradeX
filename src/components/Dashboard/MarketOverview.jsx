import useMarketData from "../../context/useMarketData";
import { formatCurrency, formatPercent } from "../../utils/formatCurrency";
import "./MarketOverview.css";

const INDEXES = [
  {
    symbol: "NIFTY50",
    name: "NIFTY 50",
  },
  {
    symbol: "SENSEX",
    name: "SENSEX",
  },
  {
    symbol: "BANKNIFTY",
    name: "BANK NIFTY",
  },
];

export default function MarketOverview() {
  const {
    getStock,
    isConnected,
    isLoading,
  } = useMarketData();

  return (
    <div className="market-card">

      {INDEXES.map((index) => {
        const market = getStock(index.symbol);

        const price = Number(
          market?.price ??
          market?.currentPrice ??
          0
        );

        const changePercent = Number(
          market?.changePercent ?? 0
        );

        const positive = changePercent >= 0;

        return (
          <div
            className="market-row"
            key={index.symbol}
          >
            <div>
              <h4>{index.name}</h4>

              <small>
                {isLoading
                  ? "Loading..."
                  : formatCurrency(price)}
              </small>
            </div>

            <span
              className={
                positive
                  ? "green"
                  : "red"
              }
            >
              {positive ? "+" : ""}
              {formatPercent(changePercent)}
            </span>
          </div>
        );
      })}

      <div className="market-live-status">
        <span
          className={
            isConnected
              ? "dot live"
              : "dot offline"
          }
        />

        {isConnected
          ? "Live market data"
          : "Connecting..."}
      </div>

    </div>
  );
}