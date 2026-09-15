import { useMemo, useState } from "react";
import useStocks from "../../hooks/useStocks";
import StockCard from "../StockCard/StockCard";
import StockDetailPanel from "../StockDetailPanel/StockDetailPanel";
import "./LiveMarket.css";

const TABS = ["ALL", "NSE", "BSE"];

const SORTS = {
  NAME: "name",
  GAINERS: "gainers",
  LOSERS: "losers",
};

export default function LiveMarket() {
  const { stocks, isConnected, isLoading, error } = useStocks();

  const [exchange, setExchange] = useState("ALL");
  const [sortBy, setSortBy] = useState(SORTS.NAME);

  // NEW
  const [selectedStock, setSelectedStock] = useState(null);

  const filtered = useMemo(() => {
    let list =
      exchange === "ALL"
        ? stocks
        : stocks.filter((s) => s.exchange === exchange);

    list = [...list];

    if (sortBy === SORTS.GAINERS) {
      list.sort(
        (a, b) =>
          (b.changePercent ?? 0) -
          (a.changePercent ?? 0)
      );
    } else if (sortBy === SORTS.LOSERS) {
      list.sort(
        (a, b) =>
          (a.changePercent ?? 0) -
          (b.changePercent ?? 0)
      );
    } else {
      list.sort((a, b) =>
        a.symbol.localeCompare(b.symbol)
      );
    }

    return list;
  }, [stocks, exchange, sortBy]);

  const nseCount = stocks.filter(
    (s) => s.exchange === "NSE"
  ).length;

  const bseCount = stocks.filter(
    (s) => s.exchange === "BSE"
  ).length;

  const tabCounts = {
    ALL: stocks.length,
    NSE: nseCount,
    BSE: bseCount,
  };

  // NEW
  const handleStockClick = (stock) => {
    console.log("Selected stock:", stock);
    setSelectedStock(stock);
  };

  // NEW
  const handleCloseStock = () => {
    setSelectedStock(null);
  };

  return (
    <div className="live-market">

      <div className="live-market__header">

        <div>
          <h2>Live Market</h2>

          <p>
            Real-time NSE & BSE prices
          </p>
        </div>

        <span
          className={`live-market__status ${
            isConnected ? "live" : "offline"
          }`}
        >
          <span className="dot" />

          {isConnected
            ? "Live"
            : "Connecting..."}
        </span>

      </div>

      <div className="live-market__controls">

        <div className="live-market__tabs">

          {TABS.map((tab) => (
            <button
              key={tab}
              className={`live-market__tab ${
                exchange === tab
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setExchange(tab)
              }
            >
              {tab}{" "}
              <span className="count">
                {tabCounts[tab]}
              </span>
            </button>
          ))}

        </div>

        <div className="live-market__sort">

          <button
            className={
              sortBy === SORTS.NAME
                ? "active"
                : ""
            }
            onClick={() =>
              setSortBy(SORTS.NAME)
            }
          >
            A–Z
          </button>

          <button
            className={
              sortBy === SORTS.GAINERS
                ? "active"
                : ""
            }
            onClick={() =>
              setSortBy(SORTS.GAINERS)
            }
          >
            Top Gainers
          </button>

          <button
            className={
              sortBy === SORTS.LOSERS
                ? "active"
                : ""
            }
            onClick={() =>
              setSortBy(SORTS.LOSERS)
            }
          >
            Top Losers
          </button>

        </div>

      </div>

      {isLoading &&
        filtered.length === 0 && (
          <p className="live-market__empty">
            Loading market data...
          </p>
        )}

      {error &&
        filtered.length === 0 && (
          <p className="live-market__empty" role="status">
            {error}
          </p>
        )}

      <div className="live-market__grid">

        {filtered.map((stock) => (

          /*
           * IMPORTANT:
           * We are NOT changing StockCard.jsx.
           *
           * We simply wrap it with a clickable div.
           */
          <div
            key={stock.symbol}
            className="stock-card-clickable"
            onClick={() =>
              handleStockClick(stock)
            }
          >
            <StockCard
              symbol={stock.symbol}
            />
          </div>

        ))}

      </div>

      {/* NEW: Stock detail panel */}

      {selectedStock && (
        <StockDetailPanel
          stock={selectedStock}
          onClose={handleCloseStock}
        />
      )}

    </div>
  );
}
