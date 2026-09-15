const stockRepository = require("./stock.repository");
const AppError = require("../../errors/AppError");

const createStock = async (stockData) => {
  const existingStock = await stockRepository.findBySymbol(
    stockData.symbol
  );

  if (existingStock) {
    throw new AppError(
      "Stock already exists",
      409,
      "STOCK_ALREADY_EXISTS"
    );
  }

  return stockRepository.createStock({
    ...stockData,
    symbol: stockData.symbol.toUpperCase(),
  });
};

const getAllStocks = async (options) => {
  return stockRepository.findAllStocks(options);
};

const getStockBySymbol = async (symbol) => {
  const stock = await stockRepository.findBySymbol(symbol);

  if (!stock) {
    throw new AppError(
      "Stock not found",
      404,
      "STOCK_NOT_FOUND"
    );
  }

  return stock;
};

const searchStocks = async (query) => {
  return stockRepository.searchStocks(query);
};

module.exports = {
  createStock,
  getAllStocks,
  getStockBySymbol,
  searchStocks,
};