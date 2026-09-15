const crypto = require("crypto");
const mongoose = require("mongoose");

const userRepository = require("../users/user.repository");
const sessionRepository = require("../sessions/session.repository");

const accountRepository = require("../accounts/account.repository");

const portfolioRepository =
  require("../portfolio/portfolio.repository");

const AppError = require("../../errors/AppError");

const {
  hashPassword,
  comparePassword,
} = require("../../utils/password");

const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../../utils/jwt");

const { hashToken } = require("../../utils/crypto");


// ==========================================
// REGISTER
// ==========================================

const register = async ({ name, email, password }) => {
  const existingUser = await userRepository.findByEmail(email);

  if (existingUser) {
    throw new AppError(
      "Email is already registered",
      409,
      "EMAIL_ALREADY_EXISTS"
    );
  }

  const passwordHash = await hashPassword(password);
const session = await mongoose.startSession();

try {
  session.startTransaction();

  const user = await userRepository.createUser(
    {
      name,
      email,
      passwordHash,
    },
    session
  );

  await accountRepository.createAccount(user._id, session);
  await portfolioRepository.createPortfolio(user._id, session);

  await session.commitTransaction();

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
};


// ==========================================
// LOGIN
// ==========================================

const login = async ({ email, password }) => {
  // 1. Find user
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new AppError(
      "Invalid email or password",
      401,
      "INVALID_CREDENTIALS"
    );
  }


  // 2. Verify password
  const isPasswordValid = await comparePassword(
    password,
    user.passwordHash
  );

  if (!isPasswordValid) {
    throw new AppError(
      "Invalid email or password",
      401,
      "INVALID_CREDENTIALS"
    );
  }


  // 3. Check account status
  if (!user.isActive) {
    throw new AppError(
      "User account is inactive",
      403,
      "ACCOUNT_INACTIVE"
    );
  }


  // 4. Create unique session ID
  const sessionId = crypto.randomUUID();


  // 5. JWT payload
  const payload = {
    userId: user._id.toString(),
    role: user.role,
    sessionId,
  };


  // 6. Generate tokens
  const accessToken = generateAccessToken(payload);

  const refreshToken = generateRefreshToken(payload);


  // 7. Hash refresh token
  const refreshTokenHash = hashToken(refreshToken);


  // 8. Determine session expiry from refresh token and save session in MongoDB
  let expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  try {
    const decoded = verifyRefreshToken(refreshToken);
    if (decoded && decoded.exp) {
      expiresAt = new Date(decoded.exp * 1000);
    }
  } catch (err) {
    // If verification fails for some reason, fallback to default expiry
  }

  await sessionRepository.createSession({
    userId: user._id,
    refreshTokenHash,
    expiresAt,
  });


  // 9. Return response
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },

    accessToken,

    refreshToken,
  };
};

const getValidSessionForRefreshToken = async (userId, refreshToken) => {
  const sessions = await sessionRepository.findByUserId(userId);
  const refreshTokenHash = hashToken(refreshToken);
  const activeSession = sessions.find(
    (session) => session.refreshTokenHash === refreshTokenHash
  );

  if (!activeSession) {
    throw new AppError("Invalid refresh token", 401, "INVALID_REFRESH_TOKEN");
  }

  if (activeSession.revokedAt) {
    throw new AppError("Session revoked", 401, "SESSION_REVOKED");
  }

  if (new Date(activeSession.expiresAt) <= new Date()) {
    throw new AppError("Session expired", 401, "SESSION_EXPIRED");
  }

  return activeSession;
};

const getExpiryFromToken = (token) => {
  try {
    const decoded = verifyRefreshToken(token);

    if (decoded && decoded.exp) {
      return new Date(decoded.exp * 1000);
    }
  } catch (error) {
    // Ignore and fall back to default expiry.
  }

  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
};

const refresh = async ({ refreshToken }) => {
  let decoded;

  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new AppError("Invalid refresh token", 401, "INVALID_REFRESH_TOKEN");
  }

  if (!decoded || !decoded.userId) {
    throw new AppError("Invalid refresh token", 401, "INVALID_REFRESH_TOKEN");
  }

  const currentRefreshTokenHash = hashToken(refreshToken);

  const rotatedPayload = {
    userId: decoded.userId,
    role: decoded.role,
    sessionId: decoded.sessionId,
  };

  const accessToken = generateAccessToken(rotatedPayload);

  const newRefreshToken = generateRefreshToken(rotatedPayload);
  const newRefreshTokenHash = hashToken(newRefreshToken);
  const newExpiresAt = getExpiryFromToken(newRefreshToken);

  const rotatedSession = await sessionRepository.rotateRefreshToken({
    userId: decoded.userId,
    refreshTokenHash: currentRefreshTokenHash,
    newRefreshTokenHash,
    expiresAt: newExpiresAt,
  });

  if (!rotatedSession) {
    try {
      await getValidSessionForRefreshToken(decoded.userId, refreshToken);
    } catch (error) {
      throw error;
    }

    throw new AppError("Invalid refresh token", 401, "INVALID_REFRESH_TOKEN");
  }

  return {
    accessToken,
    refreshToken: newRefreshToken,
    user: {
      id: decoded.userId,
      role: decoded.role,
    },
  };
};

const logout = async ({ refreshToken }) => {
  let decoded;

  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new AppError("Invalid refresh token", 401, "INVALID_REFRESH_TOKEN");
  }

  if (!decoded || !decoded.userId) {
    throw new AppError("Invalid refresh token", 401, "INVALID_REFRESH_TOKEN");
  }

  const session = await getValidSessionForRefreshToken(decoded.userId, refreshToken);

  await sessionRepository.revokeSession(session._id);

  return { revoked: true };
};

module.exports = {
  register,
  login,
  refresh,
  logout,
};