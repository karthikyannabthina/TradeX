const jwt = require("jsonwebtoken");
const app = require("../../src/app");
const AppError = require("../../src/errors/AppError");
const userService = require("../../src/modules/users/user.service");

process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "test-access-secret";
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "test-refresh-secret";

describe("User route", () => {
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

  const requestProfile = async (token, query = "") => {
    const port = server.address().port;
    return fetch(`http://localhost:${port}/api/v1/users/me${query}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  };

  const updateProfile = async (token, body = {}, query = "") => {
    const port = server.address().port;
    return fetch(`http://localhost:${port}/api/v1/users/me${query}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
  };

  describe("GET /api/v1/users/me", () => {
    test("authenticated user receives their own profile", async () => {
      const profile = {
        id: "user-a",
        name: "Alice",
        email: "alice@example.com",
        role: "USER",
        isActive: true,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-02T00:00:00.000Z",
      };

      const serviceSpy = jest
        .spyOn(userService, "getProfile")
        .mockResolvedValue(profile);

      const token = createToken("user-a");
      const response = await requestProfile(token);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.message).toBe("Profile retrieved successfully");
      expect(body.data.user).toEqual(profile);
      expect(serviceSpy).toHaveBeenCalledWith("user-a");
    });

    test("unauthenticated request returns 401", async () => {
      const response = await requestProfile(null);
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error.code).toBe("AUTHENTICATION_REQUIRED");
    });

    test("passwordHash is not exposed", async () => {
      const profile = {
        id: "user-a",
        name: "Alice",
        email: "alice@example.com",
        role: "USER",
        isActive: true,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-02T00:00:00.000Z",
      };

      jest.spyOn(userService, "getProfile").mockResolvedValue(profile);

      const response = await requestProfile(createToken("user-a"));
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.data.user.passwordHash).toBeUndefined();
      expect(Object.keys(body.data.user)).not.toContain("passwordHash");
    });

    test("user A cannot retrieve user B by supplying userId", async () => {
      const profile = {
        id: "user-a",
        name: "Alice",
        email: "alice@example.com",
        role: "USER",
        isActive: true,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-02T00:00:00.000Z",
      };

      const serviceSpy = jest
        .spyOn(userService, "getProfile")
        .mockResolvedValue(profile);

      const token = createToken("user-a");
      const response = await requestProfile(token, "?userId=user-b");
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.data.user.id).toBe("user-a");
      expect(serviceSpy).toHaveBeenCalledWith("user-a");
      expect(serviceSpy).not.toHaveBeenCalledWith("user-b");
    });

    test("missing user returns USER_NOT_FOUND", async () => {
      jest.spyOn(userService, "getProfile").mockRejectedValue(
        new AppError("User not found", 404, "USER_NOT_FOUND")
      );

      const response = await requestProfile(createToken("user-a"));
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body.success).toBe(false);
      expect(body.error.code).toBe("USER_NOT_FOUND");
      expect(body.error.message).toBe("User not found");
    });
  });

  describe("PATCH /api/v1/users/me", () => {
    test("authenticated user can update their own profile", async () => {
      const updatedProfile = {
        id: "user-a",
        name: "Alice Updated",
        email: "alice.updated@example.com",
        role: "USER",
        isActive: true,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-03T00:00:00.000Z",
      };

      const serviceSpy = jest
        .spyOn(userService, "updateProfile")
        .mockResolvedValue(updatedProfile);

      const token = createToken("user-a");
      const response = await updateProfile(token, {
        name: "Alice Updated",
        email: "alice.updated@example.com",
      });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.message).toBe("Profile updated successfully");
      expect(body.data.user).toEqual(updatedProfile);
      expect(serviceSpy).toHaveBeenCalledWith("user-a", {
        name: "Alice Updated",
        email: "alice.updated@example.com",
      });
    });

    test("unauthenticated request returns 401", async () => {
      const response = await updateProfile(null, {
        name: "Alice Updated",
      });
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error.code).toBe("AUTHENTICATION_REQUIRED");
    });

    test("user A cannot update user B through userId override", async () => {
      const updatedProfile = {
        id: "user-a",
        name: "Alice Updated",
        email: "alice@example.com",
        role: "USER",
        isActive: true,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-03T00:00:00.000Z",
      };

      const serviceSpy = jest
        .spyOn(userService, "updateProfile")
        .mockResolvedValue(updatedProfile);

      const token = createToken("user-a");
      const response = await updateProfile(token, { name: "Alice Updated" }, "?userId=user-b");
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.data.user.id).toBe("user-a");
      expect(serviceSpy).toHaveBeenCalledWith("user-a", {
        name: "Alice Updated",
      });
      expect(serviceSpy).not.toHaveBeenCalledWith("user-b", expect.anything());
    });

    test("passwordHash cannot be mass-assigned", async () => {
      const serviceSpy = jest.spyOn(userService, "updateProfile");

      const response = await updateProfile(createToken("user-a"), {
        name: "Alice",
        passwordHash: "attacker-hash",
      });
      const body = await response.json();

      expect(response.status).toBe(422);
      expect(body.success).toBe(false);
      expect(body.error.code).toBe("VALIDATION_ERROR");
      expect(serviceSpy).not.toHaveBeenCalled();
    });

    test("role cannot be mass-assigned", async () => {
      const serviceSpy = jest.spyOn(userService, "updateProfile");

      const response = await updateProfile(createToken("user-a"), {
        name: "Alice",
        role: "ADMIN",
      });
      const body = await response.json();

      expect(response.status).toBe(422);
      expect(body.success).toBe(false);
      expect(body.error.code).toBe("VALIDATION_ERROR");
      expect(serviceSpy).not.toHaveBeenCalled();
    });

    test("isActive cannot be mass-assigned", async () => {
      const serviceSpy = jest.spyOn(userService, "updateProfile");

      const response = await updateProfile(createToken("user-a"), {
        name: "Alice",
        isActive: false,
      });
      const body = await response.json();

      expect(response.status).toBe(422);
      expect(body.success).toBe(false);
      expect(body.error.code).toBe("VALIDATION_ERROR");
      expect(serviceSpy).not.toHaveBeenCalled();
    });

    test("invalid profile data is rejected", async () => {
      const serviceSpy = jest.spyOn(userService, "updateProfile");

      const response = await updateProfile(createToken("user-a"), {
        name: "A",
        email: "bad-email",
      });
      const body = await response.json();

      expect(response.status).toBe(422);
      expect(body.success).toBe(false);
      expect(body.error.code).toBe("VALIDATION_ERROR");
      expect(serviceSpy).not.toHaveBeenCalled();
    });

    test("empty patch payload is rejected", async () => {
      const serviceSpy = jest.spyOn(userService, "updateProfile");

      const response = await updateProfile(createToken("user-a"), {});
      const body = await response.json();

      expect(response.status).toBe(422);
      expect(body.success).toBe(false);
      expect(body.error.code).toBe("VALIDATION_ERROR");
      expect(serviceSpy).not.toHaveBeenCalled();
    });

    test("partial update works", async () => {
      const updatedProfile = {
        id: "user-a",
        name: "Alice",
        email: "alice.new@example.com",
        role: "USER",
        isActive: true,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-03T00:00:00.000Z",
      };

      const serviceSpy = jest
        .spyOn(userService, "updateProfile")
        .mockResolvedValue(updatedProfile);

      const response = await updateProfile(createToken("user-a"), {
        email: "alice.new@example.com",
      });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.data.user.email).toBe("alice.new@example.com");
      expect(serviceSpy).toHaveBeenCalledWith("user-a", {
        email: "alice.new@example.com",
      });
    });

    test("duplicate email returns EMAIL_ALREADY_EXISTS", async () => {
      jest.spyOn(userService, "updateProfile").mockRejectedValue(
        new AppError("Email is already registered", 409, "EMAIL_ALREADY_EXISTS")
      );

      const response = await updateProfile(createToken("user-a"), {
        email: "taken@example.com",
      });
      const body = await response.json();

      expect(response.status).toBe(409);
      expect(body.success).toBe(false);
      expect(body.error.code).toBe("EMAIL_ALREADY_EXISTS");
      expect(body.error.message).toBe("Email is already registered");
    });
  });
});
