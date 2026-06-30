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

            <th>Avg</th>

            <th>Current</th>

          </tr>

        </thead>

        <tbody>

          {positions.map((item) => (

            <tr key={item.stock}>

              <td>{item.stock}</td>

              <td>{item.qty}</td>

              <td>₹{item.avg}</td>

              <td>₹{item.current}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}