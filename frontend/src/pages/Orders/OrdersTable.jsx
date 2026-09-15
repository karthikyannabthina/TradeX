import OrderRow from "./OrderRow";

export default function OrdersTable({
  orders,
  onView,
}) {

  return (

    <div className="orders-table-container">

      <table className="orders-table">

        <thead>

          <tr>

            <th>Order ID</th>
            <th>Type</th>
            <th>Stock</th>
            <th>Exchange</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Status</th>
            <th>Date</th>
            <th>Time</th>
            <th>Action</th>

          </tr>

        </thead>

        <tbody>

          {orders.map((order) => (

            <OrderRow
              key={order.id}
              order={order}
              onView={onView}
            />

          ))}

        </tbody>

      </table>

    </div>

  );
}