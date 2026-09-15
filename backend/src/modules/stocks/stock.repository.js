const Stock = require("./stock.model");

const createStock = async (stockData) => {
  return Stock.create(stockData);
};

const findAllStocks = async ({
  page = 1,
  limit = 20,
  search,
  exchange,
  sector,
  sortBy = "symbol",
  sortOrder = "asc",
}) => {
  const filter = {
    isActive: true,
  };

  if (exchange) {
    filter.exchange = exchange;
  }

  if (sector) {
    filter.sector = sector;
  }

  if (search) {
    filter.$or = [
      {
        symbol: {
          $regex: search,
          $options: "i",
        },
      },
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  const skip = (page - 1) * limit;

  const sort = {
    [sortBy]: sortOrder === "desc" ? -1 : 1,
  };

  const [stocks, total] = await Promise.all([
    Stock.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit),

    Stock.countDocuments(filter),
  ]);

  return {
    stocks,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

const findBySymbol = async (symbol) => {
  return Stock.findOne({
    symbol: symbol.toUpperCase(),
    isActive: true,
  });
};

const findById = async (id) => {
  return Stock.findOne({
    _id: id,
    isActive: true,
  });
};

const searchStocks = async (query) => {
  return Stock.find({
    isActive: true,
    $or: [
      {
        symbol: {
          $regex: query,
          $options: "i",
        },
      },
      {
        name: {
          $regex: query,
          $options: "i",
        },
      },
    ],
  }).limit(20);
};

module.exports = {
  createStock,
  findAllStocks,
  findBySymbol,
  findById,
  searchStocks,
};