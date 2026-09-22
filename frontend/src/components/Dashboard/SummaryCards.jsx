import { useEffect, useState } from "react";
import "./SummaryCards.css";

import { getAccount } from "../../services/accountService";
import { getPortfolio } from "../../features/portfolio/PortfolioAPI";

import useMarketData from "../../context/useMarketData";

export default function SummaryCards() {
  const [summary, setSummary] = useState({
    portfolioValue: 0,
    pnl: 0,
    pnlPercent: 0,
    invested: 0,
    availableFunds: 0,
  });

  const { getStock } = useMarketData();

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const [
          accountResponse,
          portfolioResponse,
        ] = await Promise.all([
          getAccount(),
          getPortfolio(),
        ]);

        const account =
          accountResponse?.data?.account ||
          accountResponse?.account ||
          null;

        const portfolio =
          portfolioResponse?.data?.portfolio ||
          portfolioResponse?.portfolio ||
          null;

        const holdings = portfolio?.holdings || [];

        let invested = 0;
        let portfolioValue = 0;

        holdings.forEach((holding) => {
          const quantity = Number(holding.quantity || 0);
          const averagePrice = Number(
            holding.averagePrice || 0
          );

          const marketStock = getStock(holding.symbol);

          const currentPrice = Number(
            marketStock?.price ??
              marketStock?.ltp ??
              marketStock?.currentPrice ??
              averagePrice
          );

          invested += quantity * averagePrice;
          portfolioValue += quantity * currentPrice;
        });

        const pnl = portfolioValue - invested;

        const pnlPercent =
          invested > 0
            ? (pnl / invested) * 100
            : 0;

        const balance = Number(account?.balance || 0);
        const blockedAmount = Number(
          account?.blockedAmount || 0
        );

        const availableFunds =
          balance - blockedAmount;

        setSummary({
          portfolioValue,
          pnl,
          pnlPercent,
          invested,
          availableFunds,
        });
      } catch (error) {
        console.error(
          "Dashboard summary error:",
          error
        );
      }
    };

    loadSummary();
  }, []);

  const formatCurrency = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="summary-grid">

      <div className="summary-card">
        <h4>Portfolio Value</h4>

        <h2>
          {formatCurrency(summary.portfolioValue)}
        </h2>

        <p className="positive">
          {summary.pnlPercent >= 0 ? "+" : ""}
          {summary.pnlPercent.toFixed(2)}%
        </p>
      </div>


      <div className="summary-card">
        <h4>Today's P/L</h4>

        <h2
          className={
            summary.pnl >= 0
              ? "positive"
              : "negative"
          }
        >
          {summary.pnl >= 0 ? "+" : ""}
          {formatCurrency(summary.pnl)}
        </h2>

        <p
          className={
            summary.pnl >= 0
              ? "positive"
              : "negative"
          }
        >
          {summary.pnlPercent >= 0 ? "+" : ""}
          {summary.pnlPercent.toFixed(2)}%
        </p>
      </div>


      <div className="summary-card">
        <h4>Invested</h4>

        <h2>
          {formatCurrency(summary.invested)}
        </h2>

        <p></p>
      </div>


      <div className="summary-card">
        <h4>Available Funds</h4>

        <h2>
          {formatCurrency(summary.availableFunds)}
        </h2>

        <p></p>
      </div>

    </div>
  );
}