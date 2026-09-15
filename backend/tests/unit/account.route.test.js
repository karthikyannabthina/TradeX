const jwt = require("jsonwebtoken");
const app = require("../../src/app");
const AppError = require("../../src/errors/AppError");
const accountService = require("../../src/modules/accounts/account.service");

describe("Account route", () => {
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
      process.env.JWT_ACCESS_SECRET || "test-access-secret",
      { expiresIn: "1h" }
    );
  };

  const requestAccount = async (token, query = "") => {
    const port = server.address().port;
    return fetch(`http://localhost:${port}/api/v1/account${query}`, {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {},
    });
  };

  test("authenticated user can retrieve their account", async () => {
    const account = {
      userId: "user-a",
      balance: 15000,
      blockedAmount: 0,
    };

    const serviceSpy = jest
      .spyOn(accountService, "getAccount")
      .mockResolvedValue(account);

    const token = createToken("user-a");
    const response = await requestAccount(token);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe("Account retrieved successfully");
    expect(body.data.account).toEqual(account);
    expect(serviceSpy).toHaveBeenCalledWith("user-a");
  });

  test("unauthenticated request returns 401", async () => {
    const response = await requestAccount(null);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("AUTHENTICATION_REQUIRED");
  });

  test("user A cannot retrieve user B's account using query params", async () => {
    const account = {
      userId: "user-a",
      balance: 15000,
      blockedAmount: 0,
    };

    const serviceSpy = jest
      .spyOn(accountService, "getAccount")
      .mockResolvedValue(account);

    const token = createToken("user-a");
    const response = await requestAccount(token, "?userId=user-b");
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.account.userId).toBe("user-a");
    expect(serviceSpy).toHaveBeenCalledWith("user-a");
    expect(serviceSpy).not.toHaveBeenCalledWith("user-b");
  });

  test("account not found returns the appropriate AppError contract", async () => {
    jest.spyOn(accountService, "getAccount").mockRejectedValue(
      new AppError("Trading account not found", 404, "ACCOUNT_NOT_FOUND")
    );

    const response = await requestAccount(createToken("user-a"));
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("ACCOUNT_NOT_FOUND");
    expect(body.error.message).toBe("Trading account not found");
  });
});
