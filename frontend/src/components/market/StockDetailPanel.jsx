"use client";

import SearchBar from "./stock-detail/SearchBar";
import StockHeader from "./stock-detail/StockHeader";
import OrderBook from "./stock-detail/OrderBook";
import MarketStats from "./stock-detail/MarketStats";
import ActionButtons from "./stock-detail/ActionButtons";

export default function StockDetailPanel({
  stock,
  onClose,
}) {
  if (!stock) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">

      <div className="relative w-full max-w-3xl overflow-hidden bg-white shadow-2xl">

        {/* Search */}
        <SearchBar />

        {/* Stock Header */}
        <StockHeader stock={stock} />

        {/* Order Book */}
        <OrderBook orderBook={stock.orderBook} />

        {/* Market Statistics */}
        <MarketStats stats={stock.stats} />

        {/* Bottom Actions */}
        <ActionButtons
          stock={stock}
          onClose={onClose}
        />

      </div>

    </div>
  );
}