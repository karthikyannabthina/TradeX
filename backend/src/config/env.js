require("dotenv").config();

const defaultAllowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:8080",
];

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,

  mongoUri: process.env.MONGO_URI,

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },

  corsAllowedOrigins: (
    process.env.CORS_ALLOWED_ORIGINS ||
    process.env.CORS_ORIGIN ||
    defaultAllowedOrigins.join(",")
  )
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),

 authRateLimitWindowMs:
  Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,

authRateLimitMax:
  Number(process.env.AUTH_RATE_LIMIT_MAX) || 100,
};

if (!env.mongoUri) {
  throw new Error("MONGO_URI is not defined");
}

if (!env.jwt.accessSecret) {
  throw new Error("JWT_ACCESS_SECRET is not defined");
}

if (!env.jwt.refreshSecret) {
  throw new Error("JWT_REFRESH_SECRET is not defined");
}

module.exports = env;
