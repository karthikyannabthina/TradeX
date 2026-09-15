const mongoose = require("mongoose");

const AppError = require("../src/errors/AppError");

const stockRepository = require("../src/modules/stocks/stock.repository");
const marketRepository = require("../src/modules/market/market.repository");
const portfolioRepository = require("../src/modules/portfolio/portfolio.repository");
const portfolioService = require("../src/modules/portfolio/portfolio.service");
const accountRepository = require("../src/modules/accounts/account.repository");
const orderRepository = require("../src/modules/orders/order.repository");
const orderService = require("../src/modules/orders/order.service");

jest.mock("mongoose", () => ({
  startSession: jest.fn(),
}));

jest.mock("../src/modules/stocks/stock.repository", () => ({
  findBySymbol: jest.fn(),
}));

jest.mock("../src/modules/market/market.repository", () => ({
  getMarketState: jest.fn(),
}));

jest.mock("../src/modules/portfolio/portfolio.repository", () => ({
  findByUserId: jest.fn(),
}));

jest.mock("../src/modules/portfolio/portfolio.service", () => ({
  addHolding: jest.fn(),
  removeHolding: jest.fn(),
  getPortfolio: jest.fn(),
}));

jest.mock("../src/modules/accounts/account.repository", () => ({
  debitBalance: jest.fn(),
  creditBalance: jest.fn(),
  findByUserId: jest.fn(),
  createAccount: jest.fn(),
  createIfNotExists: jest.fn(),
}));

jest.mock("../src/modules/orders/order.repository", () => ({
  createOrder: jest.fn(),
  findById: jest.fn(),
  findByUser: jest.fn(),
}));

describe("Order SELL flow", () => {
  let session;

  beforeEach(() => {
    jest.clearAllMocks();

    session = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };

    mongoose.startSession.mockResolvedValue(session);
  });

  test("successful SELL executes and credits the account", async () => {
    const stock = {
      symbol: "AAPL",
      exchange: "NSE",
      isActive: true,
    };

    stockRepository.findBySymbol.mockResolvedValue(stock);
    marketRepository.getMarketState.mockResolvedValue({ currentPrice: 100 });
    portfolioService.removeHolding.mockResolvedValue({
      userId: "u1",
      holdings: [],
    });
    accountRepository.creditBalance.mockResolvedValue({
      userId: "u1",
      balance: 2500,
    });
    orderRepository.createOrder.mockResolvedValue({
      _id: "o1",
      side: "SELL",
      status: "EXECUTED",
    });

    const result = await orderService.createOrder({
      userId: "u1",
      symbol: "AAPL",
      exchange: "NSE",
      side: "SELL",
      orderType: "MARKET",
      quantity: 2,
    });

    expect(stockRepository.findBySymbol).toHaveBeenCalledWith("AAPL");
    expect(marketRepository.getMarketState).toHaveBeenCalledWith("AAPL");
    expect(portfolioService.removeHolding).toHaveBeenCalledWith({
      userId: "u1",
      symbol: "AAPL",
      exchange: "NSE",
      quantity: 2,
      session,
    });
    expect(accountRepository.creditBalance).toHaveBeenCalledWith(
      "u1",
      200,
      session
    );
    expect(orderRepository.createOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "u1",
        symbol: "AAPL",
        exchange: "NSE",
        side: "SELL",
        orderType: "MARKET",
        quantity: 2,
        executedPrice: 100,
        totalAmount: 200,
        status: "EXECUTED",
      }),
      session
    );
    expect(session.commitTransaction).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      _id: "o1",
      side: "SELL",
      status: "EXECUTED",
    });
  });

  test("SELL rejects when holdings are insufficient", async () => {
    stockRepository.findBySymbol.mockResolvedValue({
      symbol: "AAPL",
      exchange: "NSE",
      isActive: true,
    });
    marketRepository.getMarketState.mockResolvedValue({ currentPrice: 100 });
    portfolioService.removeHolding.mockRejectedValue(
      new AppError("Insufficient holdings", 400, "INSUFFICIENT_HOLDINGS")
    );

    await expect(
      orderService.createOrder({
        userId: "u1",
        symbol: "AAPL",
        exchange: "NSE",
        side: "SELL",
        orderType: "MARKET",
        quantity: 4,
      })
    ).rejects.toMatchObject({
      statusCode: 400,
      code: "INSUFFICIENT_HOLDINGS",
      message: "Insufficient holdings",
    });

    expect(accountRepository.creditBalance).not.toHaveBeenCalled();
    expect(orderRepository.createOrder).not.toHaveBeenCalled();
    expect(session.abortTransaction).toHaveBeenCalledTimes(1);
  });

  test("SELL rejects when holding is missing", async () => {
    stockRepository.findBySymbol.mockResolvedValue({
      symbol: "AAPL",
      exchange: "NSE",
      isActive: true,
    });
    marketRepository.getMarketState.mockResolvedValue({ currentPrice: 100 });
    portfolioService.removeHolding.mockRejectedValue(
      new AppError("Holding not found", 404, "HOLDING_NOT_FOUND")
    );

    await expect(
      orderService.createOrder({
        userId: "u1",
        symbol: "AAPL",
        exchange: "NSE",
        side: "SELL",
        orderType: "MARKET",
        quantity: 2,
      })
    ).rejects.toMatchObject({
      statusCode: 404,
      code: "HOLDING_NOT_FOUND",
      message: "Holding not found",
    });

    expect(accountRepository.creditBalance).not.toHaveBeenCalled();
    expect(session.abortTransaction).toHaveBeenCalledTimes(1);
  });

  test("SELL rolls back transaction if the credit step fails", async () => {
    stockRepository.findBySymbol.mockResolvedValue({
      symbol: "AAPL",
      exchange: "NSE",
      isActive: true,
    });
    marketRepository.getMarketState.mockResolvedValue({ currentPrice: 100 });
    portfolioService.removeHolding.mockResolvedValue({
      userId: "u1",
      holdings: [],
    });
    accountRepository.creditBalance.mockRejectedValue(new Error("credit failed"));

    await expect(
      orderService.createOrder({
        userId: "u1",
        symbol: "AAPL",
        exchange: "NSE",
        side: "SELL",
        orderType: "MARKET",
        quantity: 2,
      })
    ).rejects.toThrow("credit failed");

    expect(session.abortTransaction).toHaveBeenCalledTimes(1);
    expect(orderRepository.createOrder).not.toHaveBeenCalled();
  });

  test("BUY behavior remains unchanged", async () => {
    stockRepository.findBySymbol.mockResolvedValue({
      symbol: "AAPL",
      exchange: "NSE",
      isActive: true,
    });
    marketRepository.getMarketState.mockResolvedValue({ currentPrice: 100 });
    accountRepository.debitBalance.mockResolvedValue({
      userId: "u1",
      balance: 4900,
    });
    portfolioService.addHolding.mockResolvedValue({
      userId: "u1",
      holdings: [{ symbol: "AAPL", exchange: "NSE", quantity: 2 }],
    });
    orderRepository.createOrder.mockResolvedValue({
      _id: "o-buy",
      side: "BUY",
      status: "EXECUTED",
    });

    const result = await orderService.createOrder({
      userId: "u1",
      symbol: "AAPL",
      exchange: "NSE",
      side: "BUY",
      orderType: "MARKET",
      quantity: 2,
    });

    expect(accountRepository.debitBalance).toHaveBeenCalledWith(
      "u1",
      200,
      session
    );
    expect(portfolioService.addHolding).toHaveBeenCalledWith({
      userId: "u1",
      symbol: "AAPL",
      exchange: "NSE",
      quantity: 2,
      executedPrice: 100,
      session,
    });
    expect(accountRepository.creditBalance).not.toHaveBeenCalled();
    expect(result).toEqual({
      _id: "o-buy",
      side: "BUY",
      status: "EXECUTED",
    });
  });

  test("concurrent SELL attempts on the same holding result in one success and one failure", async () => {
    let sellState = 10;

    stockRepository.findBySymbol.mockResolvedValue({
      symbol: "AAPL",
      exchange: "NSE",
      isActive: true,
    });
    marketRepository.getMarketState.mockResolvedValue({ currentPrice: 100 });
    portfolioService.removeHolding.mockImplementation(async ({ quantity }) => {
      if (sellState < quantity) {
        throw new AppError("Insufficient holdings", 400, "INSUFFICIENT_HOLDINGS");
      }

      sellState -= quantity;
      return { userId: "u1", holdings: [{ symbol: "AAPL", exchange: "NSE", quantity: sellState }] };
    });
    accountRepository.creditBalance.mockResolvedValue({ userId: "u1", balance: 1000 });
    orderRepository.createOrder.mockResolvedValue({ _id: "o-sell-1", side: "SELL", status: "EXECUTED" });

    const firstResult = await orderService.createOrder({
      userId: "u1",
      symbol: "AAPL",
      exchange: "NSE",
      side: "SELL",
      orderType: "MARKET",
      quantity: 10,
    });

    expect(firstResult.side).toBe("SELL");
    expect(sellState).toBe(0);

    stockRepository.findBySymbol.mockResolvedValue({
      symbol: "AAPL",
      exchange: "NSE",
      isActive: true,
    });
    marketRepository.getMarketState.mockResolvedValue({ currentPrice: 100 });

    await expect(
      orderService.createOrder({
        userId: "u1",
        symbol: "AAPL",
        exchange: "NSE",
        side: "SELL",
        orderType: "MARKET",
        quantity: 10,
      })
    ).rejects.toMatchObject({
      code: "INSUFFICIENT_HOLDINGS",
      statusCode: 400,
    });
  });
});
