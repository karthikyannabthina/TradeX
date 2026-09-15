const jwt = require("jsonwebtoken");
const app = require("../../src/app");
const AppError = require("../../src/errors/AppError");
const portfolioService = require("../../src/modules/portfolio/portfolio.service");

process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "test-access-secret";
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "test-refresh-secret";

describe("Portfolio route", () => {
  let server;

  beforeAll(async () => {
    server = app.listen(0);
  });

  afterAll(async () => {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) return reject(error);
          resolve();
        });
      });
    }
  });

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  const createToken = (userId) => {
    return jwt.sign(
      { userId, role: "USER" },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "1h" }
    );
  };

  const requestPortfolio = async (token, query = "") => {
    const port = server.address().port;
    return fetch(`http://localhost:${port}/api/v1/portfolio${query}`, {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {},
    });
  };

  test("authenticated user can retrieve their portfolio", async () => {
    const portfolio = {
      userId: "user-a",
      holdings: [{ symbol: "AAPL", exchange: "NSE", quantity: 5 }],
    };

    const serviceSpy = jest
      .spyOn(portfolioService, "getPortfolio")
      .mockResolvedValue(portfolio);

    const token = createToken("user-a");
    const response = await requestPortfolio(token);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe("Portfolio retrieved successfully");
    expect(body.data.portfolio).toEqual(portfolio);
    expect(serviceSpy).toHaveBeenCalledWith("user-a");
  });

  test("unauthenticated request returns 401", async () => {
    const response = await requestPortfolio(null);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("AUTHENTICATION_REQUIRED");
  });

  test("user A cannot request user B's portfolio by supplying a userId", async () => {
    const portfolio = {
      userId: "user-a",
      holdings: [{ symbol: "AAPL", exchange: "NSE", quantity: 5 }],
    };

    const serviceSpy = jest
      .spyOn(portfolioService, "getPortfolio")
      .mockResolvedValue(portfolio);

    const token = createToken("user-a");
    const response = await requestPortfolio(token, "?userId=user-b");
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.portfolio.userId).toBe("user-a");
    expect(serviceSpy).toHaveBeenCalledWith("user-a");
    expect(serviceSpy).not.toHaveBeenCalledWith("user-b");
  });

  test("portfolio not found returns the existing PORTFOLIO_NOT_FOUND error", async () => {
    jest.spyOn(portfolioService, "getPortfolio").mockRejectedValue(
      new AppError("Portfolio not found", 404, "PORTFOLIO_NOT_FOUND")
    );

    const response = await requestPortfolio(createToken("user-a"));
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("PORTFOLIO_NOT_FOUND");
    expect(body.error.message).toBe("Portfolio not found");
  });
});
