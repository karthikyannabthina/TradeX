import "./Watchlist.css";

const stocks = [
  {
    symbol: "TCS",
    price: "₹3560",
    change: "+1.24%",
    positive: true,
  },
  {
    symbol: "INFY",
    price: "₹1725",
    change: "-0.48%",
    positive: false,
  },
  {
    symbol: "RELIANCE",
    price: "₹2980",
    change: "+0.92%",
    positive: true,
  },
  {
    symbol: "HDFCBANK",
    price: "₹1840",
    change: "+0.31%",
    positive: true,
  },
];

export default function Watchlist() {
  return (
    <div className="watchlist">
      <h2>Watchlist</h2>

      {stocks.map((stock) => (
        <div className="stock" key={stock.symbol}>
          <div>
            <strong>{stock.symbol}</strong>
          </div>

          <div>
            <p>{stock.price}</p>

            <span className={stock.positive ? "green" : "red"}>
              {stock.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}