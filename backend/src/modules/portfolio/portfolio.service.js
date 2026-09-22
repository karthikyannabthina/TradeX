const portfolioRepository = require("./portfolio.repository");

const AppError = require("../../errors/AppError");

const getPortfolio = async (
  userId,
  session = null
) => {
  const portfolio =
    await portfolioRepository.findByUserId(
      userId,
      session
    );

  if (!portfolio) {
    throw new AppError(
      "Portfolio not found",
      404,
      "PORTFOLIO_NOT_FOUND"
    );
  }

  return portfolio;
};

const addHolding = async ({
  userId,
  symbol,
  exchange,
  quantity,
  executedPrice,
  session = null,
}) => {
  const portfolio =
    await portfolioRepository.findByUserId(
      userId,
      session
    );

  if (!portfolio) {
    throw new AppError(
      "Portfolio not found",
      404,
      "PORTFOLIO_NOT_FOUND"
    );
  }

  const existingHolding = portfolio.holdings.find(
    (holding) =>
      holding.symbol === symbol &&
      holding.exchange === exchange
  );

  // First purchase
  if (!existingHolding) {
    portfolio.holdings.push({
      symbol,
      exchange,
      quantity,
      averagePrice: executedPrice,
    });

    if (session) {
      await portfolio.save({ session });
    } else {
      await portfolio.save();
    }

    return portfolio;
  }

  // Additional purchase
  const oldQuantity = existingHolding.quantity;
  const oldAveragePrice =
    existingHolding.averagePrice;

  const newQuantity =
    oldQuantity + quantity;

  const newAveragePrice =
    (
      oldQuantity * oldAveragePrice +
      quantity * executedPrice
    ) / newQuantity;

  existingHolding.quantity = newQuantity;

  existingHolding.averagePrice =
    Number(newAveragePrice.toFixed(2));

  if (session) {
    await portfolio.save({ session });
  } else {
    await portfolio.save();
  }

  return portfolio;
};

const removeHolding = async ({
  userId,
  symbol,
  exchange,
  quantity,
  session = null,
}) => {
  const portfolio =
    await portfolioRepository.findByUserId(
      userId,
      session
    );

  if (!portfolio) {
    throw new AppError(
      "Portfolio not found",
      404,
      "PORTFOLIO_NOT_FOUND"
    );
  }

  const holding = portfolio.holdings.find(
    (item) =>
      item.symbol === symbol &&
      item.exchange === exchange
  );

  if (!holding) {
    throw new AppError(
      "Holding not found",
      404,
      "HOLDING_NOT_FOUND"
    );
  }

  if (holding.quantity < quantity) {
    throw new AppError(
      "Insufficient holdings",
      400,
      "INSUFFICIENT_HOLDINGS"
    );
  }

  // Reduce holding quantity
  holding.quantity -= quantity;

  // Remove holding completely when quantity reaches 0
  if (holding.quantity === 0) {
    portfolio.holdings =
      portfolio.holdings.filter(
        (item) =>
          !(
            item.symbol === symbol &&
            item.exchange === exchange
          )
      );
  }

  // Save inside transaction
  if (session) {
    await portfolio.save({ session });
  } else {
    await portfolio.save();
  }

  return portfolio;
};

module.exports = {
  getPortfolio,
  addHolding,
  removeHolding,
};