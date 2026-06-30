import { motion } from "framer-motion";

import "./DashboardContent.css";

import SummaryCards from "./SummaryCards";
import PortfolioChart from "./PortfolioChart";
import Watchlist from "./Watchlist";
import HoldingsTable from "./HoldingsTable";

import { fadeUp } from "../../animations/variants";

export default function DashboardContent() {
  return (
    <motion.div
      className="dashboard-content"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
    >
      <h1>Good Morning, Karthik 👋</h1>

      <div className="dashboard-grid">
        <SummaryCards />

        <PortfolioChart />

        <div className="bottom-grid">
          <Watchlist />
          <HoldingsTable />
        </div>
      </div>
    </motion.div>
  );
}