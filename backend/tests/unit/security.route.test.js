const jwt = require("jsonwebtoken");
const app = require("../../src/app");
const stockService = require("../../src/modules/stocks/stock.service");

process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "test-access-secret";
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "test-refresh-secret";

describe("Security route protections", () => {
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

  const createToken = (userId, role = "USER") => {
    return jwt.sign(
      { userId, role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "1h" }
    );
  };

  const createStock = async (token, body = {}, query = "") => {
    const port = server.address().port;
    return fetch(`http://localhost:${port}/api/v1/stocks${query}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
  };

  test("unauthenticated POST /api/v1/stocks returns 401", async () => {
    const response = await createStock(null, {
      symbol: "AAPL",
      name: "Apple",
      exchange: "NSE",
      currentPrice: 100,
      previousClose: 95,
      dayOpen: 96,
      dayHigh: 101,
      dayLow: 95,
      sector: "Technology",
    });
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("AUTHENTICATION_REQUIRED");
  });

  test("authenticated non-admin POST /api/v1/stocks returns 403", async () => {
    const response = await createStock(createToken("user-a", "USER"), {
      symbol: "AAPL",
      name: "Apple",
      exchange: "NSE",
      currentPrice: 100,
      previousClose: 95,
      dayOpen: 96,
      dayHigh: 101,
      dayLow: 95,
      sector: "Technology",
    });
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("FORBIDDEN");
  });

  test("authenticated admin POST /api/v1/stocks is allowed", async () => {
    const stock = {
      symbol: "AAPL",
      name: "Apple",
      exchange: "NSE",
      currentPrice: 100,
      previousClose: 95,
      dayOpen: 96,
      dayHigh: 101,
      dayLow: 95,
      sector: "Technology",
    };

    const serviceSpy = jest
      .spyOn(stockService, "createStock")
      .mockResolvedValue({ ...stock, _id: "stock-1" });

    const response = await createStock(createToken("admin-1", "ADMIN"), stock);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.success).toBe(true);
    expect(serviceSpy).toHaveBeenCalledWith(expect.objectContaining(stock));
  });

  test("client cannot elevate role through request body or query params", async () => {
    const serviceSpy = jest.spyOn(stockService, "createStock");

    const bodyResponse = await createStock(createToken("user-a", "USER"), {
      role: "ADMIN",
      symbol: "AAPL",
      name: "Apple",
      exchange: "NSE",
      currentPrice: 100,
      previousClose: 95,
      dayOpen: 96,
      dayHigh: 101,
      dayLow: 95,
    });

    const queryResponse = await createStock(
      createToken("user-a", "USER"),
      {
        symbol: "AAPL",
        name: "Apple",
        exchange: "NSE",
        currentPrice: 100,
        previousClose: 95,
        dayOpen: 96,
        dayHigh: 101,
        dayLow: 95,
      },
      "?role=admin"
    );

    expect(bodyResponse.status).toBe(403);
    expect(queryResponse.status).toBe(403);
    expect(serviceSpy).not.toHaveBeenCalled();
  });
});
