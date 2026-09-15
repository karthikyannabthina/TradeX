import "./Positions.css";

const positions = [
  {
    stock: "TCS",
    qty: 10,
    avg: 3400,
    current: 3560,
  },
  {
    stock: "INFY",
    qty: -5,
    avg: 1725,
    current: 1718,
  },
  {
    stock: "HDFCBANK",
    qty: 20,
    avg: 1810,
    current: 1840,
  },
];

const formatCurrency = (value) =>
  `₹${Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function Positions() {
  return (
    <div className="positions-page">
      <h1>Open Positions</h1>

      <div className="day-card">
        <h3>Today's P&L</h3>
        <h2 className="green">+₹2,340</h2>
      </div>

      <table>
        <thead>
          <tr>
            <th>Stock</th>
            <th>Qty</th>
            <th>Avg Price</th>
            <th>LTP</th>
            <th>P&L</th>
            <th>P&L %</th>
          </tr>
        </thead>

        <tbody>
          {positions.map((item) => {
            const investment =
              Math.abs(item.qty) * item.avg;

            const currentValue =
              Math.abs(item.qty) * item.current;

            const pnl =
              currentValue - investment;

            const pnlPercent = investment
              ? (pnl / investment) * 100
              : 0;

            const positive = pnl >= 0;

            return (
              <tr key={item.stock}>
                <td>{item.stock}</td>

                <td>{item.qty}</td>

                <td>
                  {formatCurrency(item.avg)}
                </td>

                <td>
                  {formatCurrency(item.current)}
                </td>

                <td className={positive ? "green" : "red"}>
                  {positive ? "+" : ""}
                  {formatCurrency(pnl)}
                </td>

                <td className={positive ? "green" : "red"}>
                  {positive ? "+" : ""}
                  {pnlPercent.toFixed(2)}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}