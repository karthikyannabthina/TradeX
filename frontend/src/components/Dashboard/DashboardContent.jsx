import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import "./DashboardContent.css";

import SummaryCards from "./SummaryCards";
import PortfolioChart from "./PortfolioChart";
import MarketOverview from "./MarketOverview";
import HoldingsTable from "./HoldingsTable";
import Watchlist from "./Watchlist";
import QuickActions from "./QuickActions";

import { fadeUp } from "../../animations/variants";
import { getOrders } from "../../services/orderServiceClient";
import { useAuth } from "../../context/AuthContext";

import NewOrderModal from "../../pages/Orders/NewOrderModal";

export default function DashboardContent() {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);

  const [showNewOrder, setShowNewOrder] = useState(false);

  const [orderType, setOrderType] = useState("BUY");

  const [selectedStock, setSelectedStock] = useState("");

  const [selectedPrice, setSelectedPrice] = useState(0);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await getOrders();

        const data =
          response?.data ||
          response ||
          [];

        setOrders(data.slice(0, 2));
      } catch (error) {
        console.error(
          "Dashboard orders error:",
          error
        );
      }
    };

    loadOrders();
  }, []);

  function handleQuickOrder(
    type,
    stock = "",
    price = 0
  ) {
    setOrderType(type);
    setSelectedStock(stock);
    setSelectedPrice(price);
    setShowNewOrder(true);
  }

  function handleOrderAdded(newOrder) {
    setOrders((prevOrders) => [
      newOrder,
      ...prevOrders,
    ].slice(0, 2));

    setShowNewOrder(false);
  }

  return (
    <motion.main
      className="dashboard-content"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
    >
      {/* =========================
          HEADER
      ========================= */}

      <header className="dashboard-header">
        <div className="dashboard-heading">
          <span className="dashboard-eyebrow">
            OVERVIEW
          </span>

          <h1>
            Good morning, {user?.name || "Trader"}
          </h1>

          <p>
            Here's what's happening with your portfolio today.
          </p>
        </div>

        <div className="market-status">
          <span className="live-dot" />

          <div>
            <span className="market-status-label">
              Market
            </span>

            <strong>
              Open
            </strong>
          </div>
        </div>
      </header>

      {/* =========================
          SUMMARY CARDS
      ========================= */}

      <section className="dashboard-summary">
        <SummaryCards />
      </section>

      {/* =========================
          MARKET CHART + WATCHLIST
      ========================= */}

      <section className="dashboard-main-grid">
        <div className="dashboard-panel performance-panel">
          <PortfolioChart
            onTrade={handleQuickOrder}
          />
        </div>

        <div className="dashboard-panel watchlist-panel">
          <div className="panel-heading">
            <div>
              <span className="section-label">
                MARKET
              </span>

              <h2>
                Watchlist
              </h2>
            </div>

            <button className="panel-link">
              View all
            </button>
          </div>

          <Watchlist />
        </div>
      </section>

      {/* =========================
          MARKET OVERVIEW
      ========================= */}

      <section className="dashboard-panel market-overview-panel">
        <div className="panel-heading">
          <div>
            <span className="section-label">
              MARKET
            </span>

            <h2>
              Market Overview
            </h2>
          </div>

          <span className="market-live">
            <span className="live-dot" />
            Live
          </span>
        </div>

        <MarketOverview />
      </section>

      {/* =========================
          HOLDINGS + ORDERS
      ========================= */}

      <section className="dashboard-bottom-grid">

        {/* HOLDINGS */}

        <div className="dashboard-panel holdings-panel">
          <div className="panel-heading">
            <div>
              <span className="section-label">
                PORTFOLIO
              </span>

              <h2>
                Holdings
              </h2>
            </div>

            <button className="panel-link">
              View all
            </button>
          </div>

          <HoldingsTable />
        </div>

        {/* RECENT ORDERS */}

        <div className="dashboard-panel recent-orders-panel">
          <div className="panel-heading">
            <div>
              <span className="section-label">
                ACTIVITY
              </span>

              <h2>
                Recent Orders
              </h2>
            </div>

            <button className="panel-link">
              View all
            </button>
          </div>

          <div className="recent-orders-list">
            {orders.length === 0 ? (
              <div className="recent-order">
                <span>
                  No recent orders
                </span>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  className="recent-order"
                  key={order._id}
                >
                  <div className="order-symbol">
                    <span className="order-avatar">
                      {order.symbol?.charAt(0)}
                    </span>

                    <div>
                      <strong>
                        {order.symbol}
                      </strong>

                      <small>
                        {order.exchange} ·{" "}
                        {order.quantity} Qty
                      </small>
                    </div>
                  </div>

                  <span
                    className={
                      order.side === "BUY"
                        ? "order-buy"
                        : "order-sell"
                    }
                  >
                    {order.side}
                  </span>

                  <span className="order-price">
                    ₹
                    {Number(
                      order.executedPrice || 0
                    ).toLocaleString("en-IN")}
                  </span>

                  <span
                    className={
                      order.status === "EXECUTED"
                        ? "order-status completed"
                        : "order-status pending"
                    }
                  >
                    {order.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* =========================
          QUICK ACTIONS
      ========================= */}

      <section className="dashboard-panel quick-actions-panel">
        <QuickActions
          onOrder={handleQuickOrder}
        />
      </section>

      {/* =========================
          NEW ORDER MODAL
      ========================= */}

      {showNewOrder && (
        <NewOrderModal
          initialType={orderType}
          initialStock={selectedStock}
          initialPrice={selectedPrice}
          onClose={() =>
            setShowNewOrder(false)
          }
          onAddOrder={handleOrderAdded}
        />
      )}
    </motion.main>
  );
}