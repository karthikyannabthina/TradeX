const mongoose = require("mongoose");

const orderRepository = require("./order.repository");

const accountRepository =
  require("../accounts/account.repository");

const portfolioService =
  require("../portfolio/portfolio.service");

const marketRepository =
  require("../market/market.repository");

const stockRepository =
  require("../stocks/stock.repository");

const AppError =
  require("../../errors/AppError");

const portfolioPerformanceService =
  require("../portfolio/portfolio-performance.service");  

const createOrder = async ({
  userId,
  symbol,
  exchange,
  side,
  orderType,
  quantity,
}) => {
  // --------------------------------
  // 1. Find stock
  // --------------------------------

  const stock =
    await stockRepository.findBySymbol(symbol);

  if (!stock) {
    throw new AppError(
      "Stock not found",
      404,
      "STOCK_NOT_FOUND"
    );
  }

  if (!stock.isActive) {
    throw new AppError(
      "Stock is not active",
      400,
      "STOCK_INACTIVE"
    );
  }

  if (stock.exchange !== exchange) {
    throw new AppError(
      "Stock exchange mismatch",
      400,
      "EXCHANGE_MISMATCH"
    );
  }

  // --------------------------------
  // 2. Get LIVE market price
  // --------------------------------

  const market =
    await marketRepository.getMarketState(symbol);

  if (!market) {
    throw new AppError(
      "Market data unavailable",
      503,
      "MARKET_DATA_UNAVAILABLE"
    );
  }

  const executedPrice = market.currentPrice;

  // --------------------------------
  // 3. Calculate total
  // --------------------------------

  const totalAmount =
    Number(
      (executedPrice * quantity).toFixed(2)
    );

  // --------------------------------
  // 4. Start MongoDB transaction
  // --------------------------------

  const session =
    await mongoose.startSession();

  try {
    session.startTransaction();

    // --------------------------------
    // 5. BUY
    // --------------------------------

    if (side === "BUY") {
      const account =
        await accountRepository.debitBalance(
          userId,
          totalAmount,
          session
        );

      if (!account) {
        throw new AppError(
          "Insufficient balance",
          400,
          "INSUFFICIENT_BALANCE"
        );
      }

      // Add shares to portfolio
      await portfolioService.addHolding({
        userId,
        symbol,
        exchange,
        quantity,
        executedPrice,
        session,
      });
    }

    if (side === "SELL") {
      await portfolioService.removeHolding({
        userId,
        symbol,
        exchange,
        quantity,
        session,
      });

      const account =
        await accountRepository.creditBalance(
          userId,
          totalAmount,
          session
        );

      if (!account) {
        throw new AppError(
          "Account not found",
          404,
          "ACCOUNT_NOT_FOUND"
        );
      }
    }

    // --------------------------------
    // 6. Create executed order
    // --------------------------------

    const order =
      await orderRepository.createOrder(
        {
          userId,
          symbol,
          exchange,
          side,
          orderType,
          quantity,
          requestedPrice: null,
          executedPrice,
          totalAmount,
          status: "EXECUTED",
          executedAt: new Date(),
        },
        session
      );

    // --------------------------------
// 7. Create portfolio performance snapshot
// --------------------------------

const updatedPortfolio =
  await portfolioService.getPortfolio(
    userId,
    session
  );

let portfolioValue = 0;
let investedAmount = 0;

for (const holding of updatedPortfolio.holdings) {
  const market =
    await marketRepository.getMarketState(
      holding.symbol
    );

  if (!market) {
    continue;
  }

  const quantity = Number(
    holding.quantity || 0
  );

  const averagePrice = Number(
    holding.averagePrice || 0
  );

  const currentPrice = Number(
    market.currentPrice || 0
  );

  investedAmount +=
    quantity * averagePrice;

  portfolioValue +=
    quantity * currentPrice;
}

const updatedAccount =
  await accountRepository.findByUserId(
    userId,
    session
  );

const availableFunds =
  Number(updatedAccount?.balance || 0) -
  Number(updatedAccount?.blockedAmount || 0);

const pnl =
  portfolioValue - investedAmount;

await portfolioPerformanceService.createSnapshot({
  userId,
  portfolioValue,
  investedAmount,
  availableFunds,
  pnl,
  session,
});

    // --------------------------------
    // 8. Commit transaction
    // --------------------------------

    await session.commitTransaction();

    return order;
  } catch (error) {
    // --------------------------------
    // Rollback everything
    // --------------------------------

    await session.abortTransaction();

    throw error;
  } finally {
    await session.endSession();
  }
};

const getMyOrders = async (userId) => {
  return orderRepository.findByUser(userId);
};

module.exports = {
  createOrder,
  getMyOrders,
};