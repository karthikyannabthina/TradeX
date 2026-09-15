const marketSimulator = require("./market.simulator");


const getMarketState = async (req, res) => {
  const market =
    marketSimulator.getMarketState();

  return res.status(200).json({
    success: true,
    data: market,
  });
};


const getHistoricalCandles = async (req, res) => {
  const { symbol } = req.params;
  const { range = "1D" } = req.query;

  const candles =
    marketSimulator.getHistoricalCandles(
      symbol,
      range
    );

  return res.status(200).json({
    success: true,

    data: {
      symbol: symbol.toUpperCase(),
      range,
      candles,
    },
  });
};


module.exports = {
  getMarketState,
  getHistoricalCandles,
};