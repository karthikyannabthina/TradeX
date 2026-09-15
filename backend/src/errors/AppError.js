class AppError extends Error {
  constructor(message, statusCode, code = "INTERNAL_SERVER_ERROR") {
    super(message);

    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;