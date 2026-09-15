export default function OrderModal({ order, onClose }) {
  if (!order) return null;

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
            <strong>{order.orderId}</strong>
          </div>

          <div className="modal-row">
            <span>Stock</span>
            <strong>{order.stock}</strong>
          </div>

          <div className="modal-row">
            <span>Exchange</span>
            <strong>{order.exchange}</strong>
          </div>

          <div className="modal-row">
            <span>Type</span>

            <span
              className={
                order.type === "BUY"
                  ? "buy-badge"
                  : "sell-badge"
              }
            >
              {order.type}
            </span>

          </div>

          <div className="modal-row">
            <span>Quantity</span>
            <strong>{order.qty}</strong>
          </div>

          <div className="modal-row">
            <span>Price</span>
            <strong>₹{order.price}</strong>
          </div>

          <div className="modal-row">
            <span>Status</span>

            <span
              className={`status ${
                order.status === "Completed"
                  ? "completed"
                  : order.status === "Pending"
                  ? "pending"
                  : "cancelled"
              }`}
            >
              {order.status}
            </span>

          </div>

          <div className="modal-row">
            <span>Date</span>
            <strong>{order.date}</strong>
          </div>

          <div className="modal-row">
            <span>Time</span>
            <strong>{order.time}</strong>
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