import { useEffect, useMemo, useState } from "react";
import { getPortfolio } from "../../features/portfolio/PortfolioAPI";
import useMarketData from "../../context/useMarketData";
import "./Holdings.css";

export default function Holdings() {
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
        console.error("Portfolio error:", err);

        if (mounted) {
          setError(
            err?.response?.data?.error?.message ||
            "Unable to load portfolio"
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

  const rows = useMemo(() => {
    return holdings.map((holding) => {
      const marketStock = getStock(holding.symbol);

      const ltp = Number(
        marketStock?.price ??
        marketStock?.ltp ??
        marketStock?.currentPrice ??
        holding.averagePrice ??
        0
      );

      const quantity = Number(holding.quantity || 0);
      const averagePrice = Number(holding.averagePrice || 0);

      const investment = averagePrice * quantity;
      const currentValue = ltp * quantity;
      const pnl = currentValue - investment;

      return {
        ...holding,
        ltp,
        quantity,
        averagePrice,
        investment,
        currentValue,
        pnl,
      };
    });
  }, [holdings, getStock]);

  const totalInvestment = rows.reduce(
    (sum, stock) => sum + stock.investment,
    0
  );

  const currentValue = rows.reduce(
    (sum, stock) => sum + stock.currentValue,
    0
  );

  const totalProfit = currentValue - totalInvestment;

  const formatCurrency = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  if (loading) {
    return (
      <div className="holdings-page">
        <h1>Holdings</h1>
        <p>Loading portfolio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="holdings-page">
        <h1>Holdings</h1>
        <p className="red">{error}</p>
      </div>
    );
  }

  return (
    <div className="holdings-page">

      <h1>Holdings</h1>

      <div className="portfolio-summary">

        <div className="summary-card">
          <h4>Total Investment</h4>
          <h2>{formatCurrency(totalInvestment)}</h2>
        </div>

        <div className="summary-card">
          <h4>Current Value</h4>
          <h2>{formatCurrency(currentValue)}</h2>
        </div>

        <div className="summary-card">
          <h4>Total Profit</h4>
          <h2 className={totalProfit >= 0 ? "green" : "red"}>
            {totalProfit >= 0 ? "+" : ""}
            {formatCurrency(totalProfit)}
          </h2>
        </div>

      </div>

      {rows.length === 0 ? (
        <p>No holdings available.</p>
      ) : (
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
              <tr key={`${stock.symbol}-${stock.exchange}`}>

                <td>{stock.symbol}</td>

                <td>{stock.quantity}</td>

                <td>{formatCurrency(stock.averagePrice)}</td>

                <td>{formatCurrency(stock.ltp)}</td>

                <td className={stock.pnl >= 0 ? "green" : "red"}>
                  {stock.pnl >= 0 ? "+" : ""}
                  {formatCurrency(stock.pnl)}
                </td>

              </tr>
            ))}

          </tbody>

        </table>
      )}

    </div>
  );
}