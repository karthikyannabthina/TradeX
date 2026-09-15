import { useEffect, useMemo, useState } from "react";

import useMarketData from "../../context/useMarketData";
import { getPortfolio } from "../../services/portfolioService";

import "./HoldingsTable.css";

export default function HoldingsTable() {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { getStock } = useMarketData();

  useEffect(() => {
    let cancelled = false;

    const loadPortfolio = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getPortfolio();

        const portfolio = result?.data?.portfolio;

        if (!cancelled) {
          setHoldings(
            Array.isArray(portfolio?.holdings)
              ? portfolio.holdings
              : []
          );
        }
      } catch (err) {
        console.error("Portfolio API error:", err);

        if (!cancelled) {
          setError("Unable to load holdings.");
          setHoldings([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadPortfolio();

    return () => {
      cancelled = true;
    };
  }, []);

  const rows = useMemo(() => {
    return holdings.map((holding) => {
      const marketStock = getStock(holding.symbol);

      const avgPrice = Number(
        holding.averagePrice ?? 0
      );

      const quantity = Number(
        holding.quantity ?? 0
      );

      const ltp = Number(
        marketStock?.price ??
        marketStock?.ltp ??
        marketStock?.currentPrice ??
        avgPrice
      );

      const pnl = (ltp - avgPrice) * quantity;

      const pnlPercent = avgPrice
        ? ((ltp - avgPrice) / avgPrice) * 100
        : 0;

      return {
        symbol: holding.symbol,
        quantity,
        avgPrice,
        ltp,
        pnl,
        pnlPercent,
      };
    });
  }, [holdings, getStock]);

  if (loading) {
    return (
      <div className="holdings-table">
        <p>Loading holdings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="holdings-table">
        <p className="red">{error}</p>
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="holdings-table">
        <p>No holdings available.</p>
      </div>
    );
  }

  return (
    <div className="holdings-table">

      <table>
        <thead>
          <tr>
            <th>Stock</th>
            <th>Qty</th>
            <th>Avg</th>
            <th>LTP</th>
            <th>P&L</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((stock) => (
            <tr key={stock.symbol}>

              <td>
                <strong>
                  {stock.symbol}
                </strong>
              </td>

              <td>
                {stock.quantity}
              </td>

              <td>
                ₹{stock.avgPrice.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>

              <td>
                ₹{stock.ltp.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>

              <td
                className={
                  stock.pnl >= 0
                    ? "green"
                    : "red"
                }
              >
                {stock.pnl >= 0 ? "+" : ""}
                ₹{stock.pnl.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}

                <small>
                  {" "}
                  ({stock.pnlPercent.toFixed(2)}%)
                </small>
              </td>

            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}