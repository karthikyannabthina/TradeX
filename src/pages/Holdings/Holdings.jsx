import "./Holdings.css";

const holdings = [
  {
    symbol: "TCS",
    qty: 10,
    avg: 3400,
    ltp: 3560,
  },
  {
    symbol: "INFY",
    qty: 15,
    avg: 1700,
    ltp: 1725,
  },
  {
    symbol: "RELIANCE",
    qty: 5,
    avg: 2920,
    ltp: 2980,
  },
  {
    symbol: "HDFCBANK",
    qty: 20,
    avg: 1810,
    ltp: 1840,
  },
];

export default function Holdings() {
  return (
    <div className="holdings-page">

      <h1>Holdings</h1>

      <div className="portfolio-summary">

        <div className="summary-card">
          <h4>Total Investment</h4>
          <h2>₹1,22,000</h2>
        </div>

        <div className="summary-card">
          <h4>Current Value</h4>
          <h2>₹1,24,500</h2>
        </div>

        <div className="summary-card">
          <h4>Total Profit</h4>
          <h2 className="green">+₹2,500</h2>
        </div>

      </div>

      <table>

        <thead>

          <tr>
            <th>Stock</th>
            <th>Qty</th>
            <th>Avg</th>
            <th>LTP</th>
            <th>P&L</th>
          </tr>

        </thead>

        <tbody>

          {holdings.map((stock) => {

            const pnl = (stock.ltp - stock.avg) * stock.qty;

            return (

              <tr key={stock.symbol}>

                <td>{stock.symbol}</td>

                <td>{stock.qty}</td>

                <td>₹{stock.avg}</td>

                <td>₹{stock.ltp}</td>

                <td className={pnl >= 0 ? "green" : "red"}>
                  ₹{pnl}
                </td>

              </tr>

            );

          })}

        </tbody>

      </table>

    </div>
  );
}