const mongoose = require("mongoose");

const userRepository = require("../../../src/modules/users/user.repository");
const accountRepository = require("../../../src/modules/accounts/account.repository");
const portfolioRepository = require("../../../src/modules/portfolio/portfolio.repository");

const {
  hashPassword,
  comparePassword,
} = require("../../../src/utils/password");

const {
  register,
  login,
} = require("../../../src/modules/auth/auth.service");

jest.mock("mongoose", () => ({
  Schema: class MockSchema {
    static Types = {
      ObjectId: class MockObjectId {},
    };

    index() {
      return this;
    }
  },
  model: jest.fn(),
  startSession: jest.fn(),
  connection: { readyState: 1 },
}));

jest.mock("../../../src/modules/users/user.repository", () => ({
  findByEmail: jest.fn(),
  createUser: jest.fn(),
}));

jest.mock("../../../src/modules/accounts/account.repository", () => ({
  createAccount: jest.fn(),
}));

jest.mock("../../../src/modules/portfolio/portfolio.repository", () => ({
  createPortfolio: jest.fn(),
}));

jest.mock("../../../src/utils/password", () => ({
  hashPassword: jest.fn(),
  comparePassword: jest.fn(),
}));

describe("Auth Service - register()", () => {
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

  test("should register a new user successfully in one transaction", async () => {
    const input = {
      name: "Karthik",
      email: "karthik@example.com",
      password: "Password123",
    };

    const fakeUser = {
      _id: "user123",
      name: "Karthik",
      email: "karthik@example.com",
      role: "USER",
      createdAt: new Date("2026-01-01"),
    };

    userRepository.findByEmail.mockResolvedValue(null);
    hashPassword.mockResolvedValue("hashed-password");
    userRepository.createUser.mockResolvedValue(fakeUser);
    accountRepository.createAccount.mockResolvedValue({});
    portfolioRepository.createPortfolio.mockResolvedValue({});

    const result = await register(input);

    expect(mongoose.startSession).toHaveBeenCalledTimes(1);
    expect(session.startTransaction).toHaveBeenCalledTimes(1);
    expect(userRepository.createUser).toHaveBeenCalledWith(
      {
        name: input.name,
        email: input.email,
        passwordHash: "hashed-password",
      },
      session
    );
    expect(accountRepository.createAccount).toHaveBeenCalledWith(fakeUser._id, session);
    expect(portfolioRepository.createPortfolio).toHaveBeenCalledWith(fakeUser._id, session);
    expect(session.commitTransaction).toHaveBeenCalledTimes(1);
    expect(session.abortTransaction).not.toHaveBeenCalled();
    expect(session.endSession).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      id: fakeUser._id,
      name: fakeUser.name,
      email: fakeUser.email,
      role: fakeUser.role,
      createdAt: fakeUser.createdAt,
    });
  });

  test("should roll back user creation when account creation fails", async () => {
    const input = {
      name: "Karthik",
      email: "karthik@example.com",
      password: "Password123",
    };

    userRepository.findByEmail.mockResolvedValue(null);
    hashPassword.mockResolvedValue("hashed-password");
    userRepository.createUser.mockResolvedValue({
      _id: "user123",
      name: input.name,
      email: input.email,
      role: "USER",
    });
    accountRepository.createAccount.mockRejectedValue(new Error("account failed"));

    await expect(register(input)).rejects.toThrow("account failed");

    expect(session.abortTransaction).toHaveBeenCalledTimes(1);
    expect(session.commitTransaction).not.toHaveBeenCalled();
    expect(portfolioRepository.createPortfolio).not.toHaveBeenCalled();
    expect(session.endSession).toHaveBeenCalledTimes(1);
  });

  test("should roll back user and account when portfolio creation fails", async () => {
    const input = {
      name: "Karthik",
      email: "karthik@example.com",
      password: "Password123",
    };

    userRepository.findByEmail.mockResolvedValue(null);
    hashPassword.mockResolvedValue("hashed-password");
    userRepository.createUser.mockResolvedValue({
      _id: "user123",
      name: input.name,
      email: input.email,
      role: "USER",
    });
    accountRepository.createAccount.mockResolvedValue({ _id: "acct123" });
    portfolioRepository.createPortfolio.mockRejectedValue(new Error("portfolio failed"));

    await expect(register(input)).rejects.toThrow("portfolio failed");

    expect(session.abortTransaction).toHaveBeenCalledTimes(1);
    expect(session.commitTransaction).not.toHaveBeenCalled();
    expect(session.endSession).toHaveBeenCalledTimes(1);
  });

  test("should reject registration when email already exists", async () => {
    const existingUser = {
      _id: "existing-user-id",
      email: "karthik@example.com",
    };

    userRepository.findByEmail.mockResolvedValue(existingUser);

    await expect(
      register({
        name: "Karthik",
        email: "karthik@example.com",
        password: "Password123",
      })
    ).rejects.toMatchObject({
      statusCode: 409,
      code: "EMAIL_ALREADY_EXISTS",
      message: "Email is already registered",
    });

    expect(userRepository.findByEmail).toHaveBeenCalledWith("karthik@example.com");
    expect(hashPassword).not.toHaveBeenCalled();
    expect(userRepository.createUser).not.toHaveBeenCalled();
    expect(accountRepository.createAccount).not.toHaveBeenCalled();
    expect(portfolioRepository.createPortfolio).not.toHaveBeenCalled();
    expect(session.startTransaction).not.toHaveBeenCalled();
  });
});

describe("Auth Service - login()", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should reject login when user does not exist", async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    await expect(
      login({
        email: "unknown@example.com",
        password: "Password123",
      })
    ).rejects.toMatchObject({
      statusCode: 401,
      code: "INVALID_CREDENTIALS",
      message: "Invalid email or password",
    });

    expect(userRepository.findByEmail).toHaveBeenCalledWith("unknown@example.com");
    expect(comparePassword).not.toHaveBeenCalled();
  });
});
