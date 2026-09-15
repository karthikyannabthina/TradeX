import useStock from "../../hooks/useStock";
import { formatCurrency, formatChange, formatPercent } from "../../utils/formatCurrency";
import "./LivePrice.css";

export default function LivePrice({ symbol = "RELIANCE" }) {
  const { stock, isConnected } = useStock(symbol);

  const isPositive = (stock?.change ?? 0) >= 0;

  return (
    <div className="live-price">
      <div className="live-price__header">
        <h2>{symbol}</h2>
        <span className={`live-price__badge ${isConnected ? "live" : "offline"}`}>
          <span className="dot" /> {isConnected ? "LIVE" : "CONNECTING"}
        </span>
      </div>

      <h1 className="live-price__value">{stock ? formatCurrency(stock.price) : "..."}</h1>

      {stock && (
        <p className={`live-price__change ${isPositive ? "up" : "down"}`}>
          {formatChange(stock.change)} ({formatPercent(stock.changePercent)})
        </p>
      )}

      <p className="live-price__updated">
        {stock ? `Updated ${new Date().toLocaleTimeString()}` : "Waiting for data..."}
      </p>
    </div>
  );
}
