const portfolioRepository = require("../../src/modules/portfolio/portfolio.repository");
const Portfolio = require("../../src/modules/portfolio/portfolio.model");
const portfolioService = require("../../src/modules/portfolio/portfolio.service");

jest.mock("../../src/modules/portfolio/portfolio.repository", () => ({
  findByUserId: jest.fn(),
}));

jest.mock("../../src/modules/portfolio/portfolio.model", () => ({
  findOneAndUpdate: jest.fn(),
}));

describe("Portfolio SELL atomic guard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("removeHolding uses a MongoDB atomic quantity guard and session", async () => {
    const session = { id: "session-1" };

    portfolioRepository.findByUserId.mockResolvedValue({
      userId: "u1",
      holdings: [{ symbol: "AAPL", exchange: "NSE", quantity: 10 }],
    });

    Portfolio.findOneAndUpdate.mockResolvedValue({
      userId: "u1",
      holdings: [],
    });

    const result = await portfolioService.removeHolding({
      userId: "u1",
      symbol: "AAPL",
      exchange: "NSE",
      quantity: 10,
      session,
    });

    expect(result).toEqual({
      userId: "u1",
      holdings: [],
    });

    expect(Portfolio.findOneAndUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "u1",
        "holdings.symbol": "AAPL",
        "holdings.exchange": "NSE",
        "holdings.quantity": { $gte: 10 },
      }),
      expect.arrayContaining([
        expect.objectContaining({
          $set: expect.objectContaining({
            holdings: expect.any(Object),
          }),
        }),
        expect.objectContaining({
          $set: expect.objectContaining({
            holdings: expect.any(Object),
          }),
        }),
      ]),
      expect.objectContaining({
        new: true,
        runValidators: true,
        session,
      })
    );
  });

  test("removeHolding rejects when the atomic update fails the quantity guard", async () => {
    const session = { id: "session-2" };

    portfolioRepository.findByUserId.mockResolvedValue({
      userId: "u1",
      holdings: [{ symbol: "AAPL", exchange: "NSE", quantity: 5 }],
    });

    Portfolio.findOneAndUpdate.mockResolvedValue(null);

    await expect(
      portfolioService.removeHolding({
        userId: "u1",
        symbol: "AAPL",
        exchange: "NSE",
        quantity: 10,
        session,
      })
    ).rejects.toMatchObject({
      statusCode: 400,
      code: "INSUFFICIENT_HOLDINGS",
      message: "Insufficient holdings",
    });
  });
});
