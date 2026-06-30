import "./Orders.css";

const orders = [
  {
    type: "BUY",
    stock: "TCS",
    qty: 10,
    price: 3560,
    status: "Completed",
  },
  {
    type: "SELL",
    stock: "INFY",
    qty: 5,
    price: 1720,
    status: "Pending",
  },
  {
    type: "BUY",
    stock: "HDFC",
    qty: 20,
    price: 1840,
    status: "Completed",
  },
];

export default function Orders() {
  return (
    <div className="orders-page">

      <div className="orders-header">

        <h1>Orders</h1>

        <button>+ New Order</button>

      </div>

      <table>

        <thead>

          <tr>

            <th>Type</th>

            <th>Stock</th>

            <th>Qty</th>

            <th>Price</th>

            <th>Status</th>

          </tr>

        </thead>

        <tbody>

          {orders.map((order, index) => (

            <tr key={index}>

              <td>{order.type}</td>

              <td>{order.stock}</td>

              <td>{order.qty}</td>

              <td>₹{order.price}</td>

              <td>{order.status}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}