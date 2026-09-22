import { useState } from "react";
import { createOrder } from "../../services/orderServiceClient";
import "./StockDetailPanel.css";

export default function StockDetailPanel({
  stock,
  onClose,
}) {

  // NEW: Buy / Sell modal state
  const [orderType, setOrderType] = useState(null);
  const [quantity, setQuantity] = useState(1);

  if (!stock) return null;

  const ltp = Number(stock.ltp ?? 0);

  const changePercent = Number(
    stock.changePercent ?? 0
  );

  const change = Number(
    stock.change ??
    stock.priceChange ??
    0
  );

  const isPositive = changePercent >= 0;

  /*
   * Temporary order book.
   *
   * Later we will replace this with
   * your real MarketSimulator data.
   */
  const bids = [
    { price: ltp - 0.1, orders: 0, qty: 0 },
    { price: ltp - 0.2, orders: 0, qty: 0 },
    { price: ltp - 0.3, orders: 0, qty: 0 },
    { price: ltp - 0.4, orders: 0, qty: 0 },
    { price: ltp - 0.5, orders: 0, qty: 0 },
  ];

  const offers = [
    { price: ltp + 0.1, orders: 0, qty: 0 },
    { price: ltp + 0.2, orders: 0, qty: 0 },
    { price: ltp + 0.3, orders: 0, qty: 0 },
    { price: ltp + 0.4, orders: 0, qty: 0 },
    { price: ltp + 0.5, orders: 0, qty: 0 },
  ];

  // NEW: Open Buy/Sell modal
  const handleBuy = () => {
    setQuantity(1);
    setOrderType("BUY");
  };

  const handleSell = () => {
    setQuantity(1);
    setOrderType("SELL");
  };

  // NEW: Close Buy/Sell modal
  const handleCloseOrder = () => {
    setOrderType(null);
  };

  // NEW: Confirm order
  const handleConfirmOrder = async () => {
    try {
        const orderData = {
            symbol: stock.symbol,
            exchange: stock.exchange,
            side: orderType,
            orderType: "MARKET",
            quantity: Number(quantity),
        };

        console.log("ORDER:", orderData);

        await createOrder(orderData);

        alert("Order placed successfully");

        setOrderType(null);

    } catch (error) {
        console.error("Order failed:", error);
        alert("Order failed");
    }
};

  return (
    <div className="stock-detail-overlay">

      <div className="stock-detail-panel">

        {/* SEARCH */}

        <div className="stock-detail-search">

          <span className="search-icon">
            ⌕
          </span>

          <input
            type="text"
            placeholder="Search eg: infy bse, nifty fut, index fund, etc."
          />

          <span className="shortcut">
            Ctrl + Shift + F
          </span>

        </div>

        {/* HEADER */}

        <div className="stock-detail-header">

          <div className="stock-detail-name">

            <strong>
              {stock.symbol}
            </strong>

            <span>
              {stock.exchange}
            </span>

          </div>

          <div className="stock-detail-price">

            <strong>
              {ltp.toFixed(2)}
            </strong>

            <span
              className={
                isPositive
                  ? "positive"
                  : "negative"
              }
            >
              {isPositive ? "+" : ""}
              {change.toFixed(2)}
              {" "}
              ({isPositive ? "+" : ""}
              {changePercent.toFixed(2)}%)
            </span>

          </div>

        </div>

        {/* ORDER BOOK */}

        <div className="order-book">

          {/* BID */}

          <div className="order-side">

            <div className="order-heading">

              <span>Bid</span>

              <span>Orders</span>

              <span>Qty.</span>

            </div>

            {bids.map((bid, index) => (

              <div
                className="order-row"
                key={index}
              >

                <span className="bid">
                  {bid.price.toFixed(2)}
                </span>

                <span>
                  {bid.orders}
                </span>

                <span>
                  {bid.qty}
                </span>

              </div>

            ))}

            <div className="order-total bid-total">

              <span>
                Total
              </span>

              <span />

              <span>
                0
              </span>

            </div>

          </div>

          {/* OFFER */}

          <div className="order-side">

            <div className="order-heading">

              <span>Offer</span>

              <span>Orders</span>

              <span>Qty.</span>

            </div>

            {offers.map((offer, index) => (

              <div
                className="order-row"
                key={index}
              >

                <span className="offer">
                  {offer.price.toFixed(2)}
                </span>

                <span>
                  {offer.orders}
                </span>

                <span>
                  {offer.qty}
                </span>

              </div>

            ))}

            <div className="order-total offer-total">

              <span>
                Total
              </span>

              <span />

              <span>
                0
              </span>

            </div>

          </div>

        </div>

        {/* MARKET STATS */}

        <div className="market-stats">

          <div className="stats-row">

            <span>
              Open
            </span>

            <strong>
              {formatValue(stock.open)}
            </strong>

            <span>
              Prev. Close
            </span>

            <strong>
              {formatValue(stock.prevClose)}
            </strong>

          </div>

          <div className="stats-row">

            <span>
              Low
            </span>

            <strong>
              {formatValue(stock.low)}
            </strong>

            <span>
              High
            </span>

            <strong>
              {formatValue(stock.high)}
            </strong>

          </div>

          {/* RANGE */}

          <div className="price-range">

            <div className="range-line" />

            <div className="range-dot left" />

            <div className="range-dot right" />

          </div>

          <div className="stats-row">

            <span>
              Volume
            </span>

            <strong>
              {stock.volume ?? "N/A"}
            </strong>

            <span>
              Avg. price
            </span>

            <strong>
              {stock.avgPrice ?? "N/A"}
            </strong>

          </div>

          <div className="stats-row">

            <span>
              Lower circuit
            </span>

            <strong>
              {formatValue(stock.lowerCircuit)}
            </strong>

            <span>
              Upper circuit
            </span>

            <strong>
              {formatValue(stock.upperCircuit)}
            </strong>

          </div>

          <div className="stats-row">

            <span>
              LTQ
            </span>

            <strong>
              {stock.ltq ?? "N/A"}
            </strong>

            <span>
              LTT
            </span>

            <strong>
              {stock.ltt ?? "N/A"}
            </strong>

          </div>

        </div>

        {/* ACTIONS */}

        <div className="stock-detail-actions">

          <button className="gtt-button">
            Create GTT
          </button>

          <div className="trade-buttons">

            {/* UPDATED */}
            <button
              className="buy-button"
              onClick={handleBuy}
            >
              Buy
            </button>

            {/* UPDATED */}
            <button
              className="sell-button"
              onClick={handleSell}
            >
              Sell
            </button>

            <button
              className="close-button"
              onClick={onClose}
            >
              Close
            </button>

          </div>

        </div>

      </div>

      {/* =====================================
          BUY / SELL ORDER MODAL
          ===================================== */}

      {orderType && (

        <div className="order-modal-overlay">

          <div className="order-modal">

            {/* HEADER */}

            <div className="order-modal-header">

              <div>

                <h3>
                  {orderType === "BUY"
                    ? "Buy"
                    : "Sell"}{" "}
                  {stock.symbol}
                </h3>

                <span>
                  {stock.exchange}
                </span>

              </div>

              <button
                className="order-modal-close"
                onClick={handleCloseOrder}
              >
                ×
              </button>

            </div>

            {/* BODY */}

            <div className="order-modal-body">

              {/* PRICE */}

              <div className="order-info">

                <span>
                  Price
                </span>

                <strong>
                  ₹
                  {ltp.toLocaleString(
                    "en-IN",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </strong>

              </div>

              {/* QUANTITY */}

              <div className="order-field">

                <label>
                  Quantity
                </label>

                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => {
                    const value =
                      Number(e.target.value);

                    setQuantity(
                      value < 1 ? 1 : value
                    );
                  }}
                />

              </div>

              {/* TOTAL */}

              <div className="order-info">

                <span>
                  Estimated value
                </span>

                <strong>
                  ₹
                  {(
                    ltp *
                    Number(quantity)
                  ).toLocaleString(
                    "en-IN",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </strong>

              </div>

            </div>

            {/* FOOTER */}

            <div className="order-modal-actions">

              <button
                className="order-cancel"
                onClick={handleCloseOrder}
              >
                Cancel
              </button>

              <button
                className={
                  orderType === "BUY"
                    ? "order-confirm-buy"
                    : "order-confirm-sell"
                }
                onClick={handleConfirmOrder}
              >
                Confirm{" "}
                {orderType === "BUY"
                  ? "Buy"
                  : "Sell"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

function formatValue(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return "N/A";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return "N/A";
  }

  return number.toLocaleString(
    "en-IN",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );
}