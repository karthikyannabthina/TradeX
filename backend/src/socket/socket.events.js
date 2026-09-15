const {
  MARKET_EVENTS,
} = require("../events/market.events");

const eventBus = require("../events/event-bus");

const initializeSocketEvents = (io) => {
  eventBus.on(
    MARKET_EVENTS.PRICE_UPDATED,
    (marketData) => {
      io.emit("market:update", marketData);
    }
  );

  console.log("📡 Market socket events initialized");
};

module.exports = {
  initializeSocketEvents,
};