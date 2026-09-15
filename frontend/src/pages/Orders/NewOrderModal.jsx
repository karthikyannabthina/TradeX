import { useState } from "react";

export default function NewOrderModal({
  onClose,
  onAddOrder,
}) {

  const [stock, setStock] = useState("");
  const [type, setType] = useState("BUY");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (
      stock.trim() === "" ||
      qty === "" ||
      price === ""
    ) {
      alert("Please fill all fields.");
      return;
    }

    const newOrder = {
      id: Date.now(),
      orderId: `TX${Date.now()}`,
      stock: stock.toUpperCase(),
      exchange: "NSE",
      type,
      qty: Number(qty),
      price: Number(price),
      status: "Pending",
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    onAddOrder(newOrder);
    onClose();
  }

  return (
    <div className="modal-overlay">

      <div className="order-modal">

        <div className="modal-header">
          <h2>Place New Order</h2>

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

          <input
            type="text"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option>BUY</option>
            <option>SELL</option>
          </select>

          <input
            type="number"
            placeholder="Quantity"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <button
            type="submit"
            className="new-order-btn"
          >
            Place Order
          </button>

        </form>

      </div>

    </div>
  );
}