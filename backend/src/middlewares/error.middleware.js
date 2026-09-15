const AppError = require("../errors/AppError");
const logger = require("../config/logger");

const errorMiddleware = (err, req, res, next) => {
  logger.error("Request failed", {
    requestId: req.requestId,
    method: req.method,
    path: req.originalUrl,
    statusCode: err && err.statusCode ? err.statusCode : 500,
    error: err && err.message ? err.message : "Unknown error",
  });

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }

  return res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong",
    },
  });
};

module.exports = errorMiddleware;