export default function OrderModal({ order, onClose }) {
  if (!order) return null;

  const date = new Date(order.createdAt);

  return (
    <div className="modal-overlay">

      <div className="order-modal card">

        <div className="modal-header">
          <h2>Order Details</h2>

          <button
            className="close-btn"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="modal-body">

          <div className="modal-row">
            <span>Order ID</span>
            <strong>{order._id}</strong>
          </div>

          <div className="modal-row">
            <span>Stock</span>
            <strong>{order.symbol}</strong>
          </div>

          <div className="modal-row">
            <span>Exchange</span>
            <strong>{order.exchange}</strong>
          </div>

          <div className="modal-row">
            <span>Type</span>

            <span
              className={
                order.side === "BUY"
                  ? "buy-badge"
                  : "sell-badge"
              }
            >
              {order.side}
            </span>
          </div>

          <div className="modal-row">
            <span>Quantity</span>
            <strong>{order.quantity}</strong>
          </div>

          <div className="modal-row">
            <span>Price</span>
            <strong>₹{order.executedPrice}</strong>
          </div>

          <div className="modal-row">
            <span>Status</span>

            <span
              className={`status ${
                order.status === "EXECUTED"
                  ? "completed"
                  : order.status === "PENDING"
                  ? "pending"
                  : "cancelled"
              }`}
            >
              {order.status}
            </span>
          </div>

          <div className="modal-row">
            <span>Date</span>
            <strong>{date.toLocaleDateString()}</strong>
          </div>

          <div className="modal-row">
            <span>Time</span>
            <strong>{date.toLocaleTimeString()}</strong>
          </div>

        </div>

        <div className="modal-footer">
          <button
            className="close-modal-btn"
            onClick={onClose}
          >
            Close
          </button>
        </div>

      </div>

    </div>
  );
}