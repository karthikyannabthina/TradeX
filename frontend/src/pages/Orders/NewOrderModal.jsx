import { useState } from "react";
import { createOrder } from "../../services/orderServiceClient";

export default function NewOrderModal({
  onClose,
  onAddOrder,
  initialType = "BUY",
  initialStock = "",
  initialPrice = 0,
}) {
  const [stock, setStock] = useState(initialStock);
  const [type, setType] = useState(initialType);
  const [qty, setQty] = useState("");
  const [loading, setLoading] = useState(false);

  const price = Number(initialPrice) || 0;
  const quantity = Number(qty) || 0;

  const estimatedValue = price * quantity;

  async function handleSubmit(e) {
    e.preventDefault();

    if (stock.trim() === "" || qty === "") {
      alert("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        symbol: stock.trim().toUpperCase(),
        exchange: "NSE",
        side: type,
        orderType: "MARKET",
        quantity: Number(qty),
      };

      const response = await createOrder(orderData);

      const newOrder = response?.data || response;

      onAddOrder(newOrder);
      onClose();
    } catch (error) {
      console.error("Order failed:", error);

      const message =
        error?.response?.data?.error?.message ||
        error?.response?.data?.message ||
        "Order failed";

      alert(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="order-modal">

        <div className="modal-header">
          <h2>
            {type === "BUY" ? "Buy" : "Sell"}{" "}
            {stock || "Stock"}
          </h2>

          <button
            className="close-btn"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form
          className="modal-body"
          onSubmit={handleSubmit}
        >

          <div className="order-stock-info">
            <strong>
              {stock || "—"}
            </strong>

            <span>
              NSE
            </span>

            <span>
              ₹
              {price.toLocaleString(
                "en-IN",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}
            </span>
          </div>

          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value)
            }
          >
            <option value="BUY">
              BUY
            </option>

            <option value="SELL">
              SELL
            </option>
          </select>

          <input
            type="number"
            placeholder="Quantity"
            min="1"
            value={qty}
            onChange={(e) =>
              setQty(e.target.value)
            }
          />

          {quantity > 0 && price > 0 && (
            <div className="order-estimate">
              <span>
                Estimated value
              </span>

              <strong>
                ₹
                {estimatedValue.toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </strong>
            </div>
          )}

          <button
            type="submit"
            className="new-order-btn"
            disabled={loading}
          >
            {loading
              ? "Placing..."
              : `${type === "BUY" ? "BUY" : "SELL"} ${
                  stock || "Stock"
                }`}
          </button>

        </form>

      </div>
    </div>
  );
}