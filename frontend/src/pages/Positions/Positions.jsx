import { useEffect, useMemo, useState } from "react";
import { getPortfolio } from "../../features/portfolio/PortfolioAPI";
import useMarketData from "../../context/useMarketData";
import "./Positions.css";

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function Positions() {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { getStock } = useMarketData();

  useEffect(() => {
    let mounted = true;

    const loadPortfolio = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getPortfolio();

        const portfolio =
          result?.data?.portfolio ||
          result?.portfolio ||
          null;

        if (mounted) {
          setHoldings(portfolio?.holdings || []);
        }
      } catch (err) {
        console.error("Positions portfolio error:", err);

        if (mounted) {
          setError(
            err?.response?.data?.error?.message ||
              "Unable to load positions"
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadPortfolio();

    return () => {
      mounted = false;
    };
  }, []);

  const positions = useMemo(() => {
    return holdings.map((holding) => {
      const marketStock = getStock(holding.symbol);

      const current =
        Number(
          marketStock?.price ??
            marketStock?.ltp ??
            marketStock?.currentPrice ??
            holding.averagePrice ??
            0
        );

      const qty = Number(holding.quantity || 0);
      const avg = Number(holding.averagePrice || 0);

      const investment = qty * avg;
      const currentValue = qty * current;
      const pnl = currentValue - investment;

      const pnlPercent = investment
        ? (pnl / investment) * 100
        : 0;

      return {
        ...holding,
        qty,
        avg,
        current,
        pnl,
        pnlPercent,
      };
    });
  }, [holdings, getStock]);

  const totalPnL = positions.reduce(
    (sum, position) => sum + position.pnl,
    0
  );

  if (loading) {
    return (
      <div className="positions-page">
        <h1>Open Positions</h1>
        <p>Loading positions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="positions-page">
        <h1>Open Positions</h1>
        <p className="red">{error}</p>
      </div>
    );
  }

  return (
    <div className="positions-page">
      <h1>Open Positions</h1>

      <div className="day-card">
        <h3>Today's P&L</h3>

        <h2 className={totalPnL >= 0 ? "green" : "red"}>
          {totalPnL >= 0 ? "+" : ""}
          {formatCurrency(totalPnL)}
        </h2>
      </div>

      {positions.length === 0 ? (
        <p>No open positions.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Stock</th>
              <th>Qty</th>
              <th>Avg Price</th>
              <th>LTP</th>
              <th>P&L</th>
              <th>P&L %</th>
            </tr>
          </thead>

          <tbody>
            {positions.map((item) => {
              const positive = item.pnl >= 0;

              return (
                <tr
                  key={`${item.symbol}-${item.exchange}`}
                >
                  <td>{item.symbol}</td>

                  <td>{item.qty}</td>

                  <td>{formatCurrency(item.avg)}</td>

                  <td>{formatCurrency(item.current)}</td>

                  <td
                    className={
                      positive ? "green" : "red"
                    }
                  >
                    {positive ? "+" : ""}
                    {formatCurrency(item.pnl)}
                  </td>

                  <td
                    className={
                      positive ? "green" : "red"
                    }
                  >
                    {positive ? "+" : ""}
                    {item.pnlPercent.toFixed(2)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}