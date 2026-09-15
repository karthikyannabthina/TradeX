const stockService = require("./stock.service");

const createStock = async (req, res) => {
  const stock = await stockService.createStock(req.validated);

  return res.status(201).json({
    success: true,
    message: "Stock created successfully",
    data: stock,
  });
};

const getAllStocks = async (req, res) => {
  const result = await stockService.getAllStocks(req.query);

  return res.status(200).json({
    success: true,
    data: result.stocks,
    pagination: {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    },
  });
};

const getStockBySymbol = async (req, res) => {
  const stock = await stockService.getStockBySymbol(
    req.params.symbol
  );

  return res.status(200).json({
    success: true,
    data: stock,
  });
};

const searchStocks = async (req, res) => {
  const stocks = await stockService.searchStocks(
    req.query.q
  );

  return res.status(200).json({
    success: true,
    data: stocks,
  });
};

module.exports = {
  createStock,
  getAllStocks,
  getStockBySymbol,
  searchStocks,
};