import StatusBadge from "./StatusBadge";

export default function OrderRow({
  order,
  onView,
}) {

  return (

    <tr>

      <td>{order.orderId}</td>

      <td>

        <span
          className={
            order.type === "BUY"
              ? "buy-badge"
              : "sell-badge"
          }
        >
          {order.type}
        </span>

      </td>

      <td className="stock-name">
        {order.stock}
      </td>

      <td>{order.exchange}</td>

      <td>{order.qty}</td>

      <td>₹{order.price}</td>

      <td>

        <StatusBadge
          status={order.status}
        />

      </td>

      <td>{order.date}</td>

      <td>{order.time}</td>

      <td>

        <button
          className="view-btn btn"
          onClick={() => onView(order)}
        >
          View
        </button>

      </td>

    </tr>

  );
}