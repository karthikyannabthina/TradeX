import "./Orders.css";

export default function OrderSummary({ orders }) {
  const totalOrders = orders.length;

  const completedOrders = orders.filter(
    (order) => order.status === "EXECUTED"
  ).length;

  const pendingOrders = orders.filter(
    (order) => order.status === "PENDING"
  ).length;

  const cancelledOrders = orders.filter(
    (order) => order.status === "CANCELLED"
  ).length;

  return (
    <div className="order-summary">

      <div className="summary-card">
        <h3>{totalOrders}</h3>
        <p>Total Orders</p>
      </div>

      <div className="summary-card">
        <h3>{completedOrders}</h3>
        <p>Completed</p>
      </div>

      <div className="summary-card">
        <h3>{pendingOrders}</h3>
        <p>Pending</p>
      </div>

      <div className="summary-card">
        <h3>{cancelledOrders}</h3>
        <p>Cancelled</p>
      </div>

    </div>
  );
}