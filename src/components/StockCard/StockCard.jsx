import useStock from "../../hooks/useStock";
import {
  formatCurrency,
  formatChange,
  formatPercent,
} from "../../utils/formatCurrency";
import "./StockCard.css";

export default function StockCard({ symbol, onClick }) {
  const { stock } = useStock(symbol);

  if (!stock) {
    return (
      <div className="stock-card stock-card--loading">
        <span className="stock-card__symbol">{symbol}</span>
        <span className="stock-card__loading-text">Loading...</span>
      </div>
    );
  }

  const isPositive = stock.change > 0;
  const isNegative = stock.change < 0;

  const color = isPositive
    ? "#00C853"
    : isNegative
    ? "#F44336"
    : "#555";

  return (
    <div
      className="stock-card"
      onClick={onClick}
      role={onClick ? "button" : undefined}
    >
      <div className="stock-card__top">
        <span className="stock-card__symbol">
          {stock.symbol}
        </span>

        <span className="stock-card__exchange">
          {stock.exchange}
        </span>
      </div>

      <div className="stock-card__name">
        {stock.name}
      </div>

      <div
        className="stock-card__price"
        style={{ color }}
      >
        {formatCurrency(stock.price)}
      </div>

      <div
        className="stock-card__change"
        style={{ color }}
      >
        {isPositive ? "▲" : isNegative ? "▼" : "●"}{" "}
        {formatChange(stock.change)} ({formatPercent(stock.changePercent)})
      </div>
    </div>
  );
}
