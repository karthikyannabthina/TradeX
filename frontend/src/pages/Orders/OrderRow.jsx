import StatusBadge from "./StatusBadge";

export default function OrderRow({
  order,
  onView,
}) {
  const date = new Date(order.createdAt);

  return (
    <tr>

      <td>{order._id}</td>

      <td>
        <span
          className={
            order.side === "BUY"
              ? "buy-badge"
              : "sell-badge"
          }
        >
          {order.side}
        </span>
      </td>

      <td className="stock-name">
        {order.symbol}
      </td>

      <td>{order.exchange}</td>

      <td>{order.quantity}</td>

      <td>₹{order.executedPrice}</td>

      <td>
        <StatusBadge
          status={order.status}
        />
      </td>

      <td>
        {date.toLocaleDateString()}
      </td>

      <td>
        {date.toLocaleTimeString()}
      </td>

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