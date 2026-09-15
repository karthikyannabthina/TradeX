import { motion } from "framer-motion";

import "./DashboardContent.css";

import SummaryCards from "./SummaryCards";
import PortfolioChart from "./PortfolioChart";
import MarketOverview from "./MarketOverview";
import HoldingsTable from "./HoldingsTable";
import Watchlist from "./Watchlist";
import QuickActions from "./QuickActions";

import { fadeUp } from "../../animations/variants";

export default function DashboardContent() {
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
            Good morning, Karthik
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

        {/* REAL STOCK MARKET CHART */}

        <div className="dashboard-panel performance-panel">

          <PortfolioChart />

        </div>


        {/* WATCHLIST */}

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

            <div className="recent-order">

              <div className="order-symbol">

                <span className="order-avatar">
                  T
                </span>

                <div>
                  <strong>
                    TCS
                  </strong>

                  <small>
                    NSE · 10 Qty
                  </small>
                </div>

              </div>

              <span className="order-buy">
                BUY
              </span>

              <span className="order-price">
                ₹3,560
              </span>

              <span className="order-status completed">
                Completed
              </span>

            </div>


            <div className="recent-order">

              <div className="order-symbol">

                <span className="order-avatar">
                  I
                </span>

                <div>
                  <strong>
                    INFY
                  </strong>

                  <small>
                    NSE · 5 Qty
                  </small>
                </div>

              </div>

              <span className="order-sell">
                SELL
              </span>

              <span className="order-price">
                ₹1,720
              </span>

              <span className="order-status pending">
                Pending
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          QUICK ACTIONS
      ========================= */}

      <section className="dashboard-panel quick-actions-panel">

        <QuickActions />

      </section>

    </motion.main>
  );
}