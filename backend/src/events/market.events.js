const eventBus = require("./event-bus");

const MARKET_EVENTS = {
  PRICE_UPDATED: "market:price-updated",
};

const emitPriceUpdated = (marketData) => {
  eventBus.emit(
    MARKET_EVENTS.PRICE_UPDATED,
    marketData
  );
};

module.exports = {
  MARKET_EVENTS,
  emitPriceUpdated,
};