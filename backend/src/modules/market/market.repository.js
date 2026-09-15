const { redisClient } = require("../../config/redis");

const MARKET_KEY = "tradex:market";

const getStockKey = (symbol) => {
  return `${MARKET_KEY}:${symbol}`;
};

const saveMarketState = async (stock) => {
  const key = getStockKey(stock.symbol);

  await redisClient.hSet(key, {
    symbol: stock.symbol,
    currentPrice: String(stock.currentPrice),
    previousClose: String(stock.previousClose),
    dayOpen: String(stock.dayOpen),
    dayHigh: String(stock.dayHigh),
    dayLow: String(stock.dayLow),
    volume: String(stock.volume),
  });
};

const getMarketState = async (symbol) => {
  const key = getStockKey(symbol);

  const data = await redisClient.hGetAll(key);

  if (!data || Object.keys(data).length === 0) {
    return null;
  }

  return {
    symbol: data.symbol,
    currentPrice: Number(data.currentPrice),
    previousClose: Number(data.previousClose),
    dayOpen: Number(data.dayOpen),
    dayHigh: Number(data.dayHigh),
    dayLow: Number(data.dayLow),
    volume: Number(data.volume),
  };
};

const deleteMarketState = async (symbol) => {
  const key = getStockKey(symbol);

  await redisClient.del(key);
};

module.exports = {
  saveMarketState,
  getMarketState,
  deleteMarketState,
};