const { verifyAccessToken } = require("../utils/jwt");
const AppError = require("../errors/AppError");

const authMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return next(
      new AppError(
        "Authentication required",
        401,
        "AUTHENTICATION_REQUIRED"
      )
    );
  }

  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(
      new AppError(
        "Invalid authorization header",
        401,
        "INVALID_AUTH_HEADER"
      )
    );
  }

  try {
    const payload = verifyAccessToken(token);

    req.user = payload;

    next();
  } catch (error) {
    return next(
      new AppError(
        "Invalid or expired access token",
        401,
        "INVALID_ACCESS_TOKEN"
      )
    );
  }
};

module.exports = authMiddleware;