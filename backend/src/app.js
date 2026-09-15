const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const corsOptions = require("./config/cors");
const { authRateLimiter } = require("./middlewares/rate-limit.middleware");

const authRoutes = require("./modules/auth/auth.routes");
const stockRoutes = require("./modules/stocks/stock.routes");
const userRoutes = require("./modules/users/user.routes");
const portfolioRoutes = require("./modules/portfolio/portfolio.routes");
const accountRoutes = require("./modules/accounts/account.routes");

const marketRoutes = require("./modules/market/market.routes");

const orderRoutes =
  require("./modules/orders/order.routes");

const notFoundMiddleware = require("./middlewares/not-found.middleware");
const errorMiddleware = require("./middlewares/error.middleware");

const requestIdMiddleware = require("./middlewares/request-id.middleware");
const { isDatabaseReady } = require("./config/database");
const { isRedisReady } = require("./config/redis");

const app = express();

app.use(requestIdMiddleware);

// Security
app.use(helmet());

// CORS
app.use(cors(corsOptions));

// Request parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookies
app.use(cookieParser());

// Logging
app.use(morgan("dev"));

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TradeX API is healthy",
  });
});

app.get("/ready", (req, res) => {
  const mongoReady = isDatabaseReady();
  const redisReady = isRedisReady();

  if (mongoReady && redisReady) {
    return res.status(200).json({
      success: true,
      data: {
        mongo: "ready",
        redis: "ready",
      },
    });
  }

  return res.status(503).json({
    success: false,
    error: {
      code: "SERVICE_UNAVAILABLE",
      message: "Dependencies unavailable",
      data: {
        mongo: mongoReady ? "ready" : "down",
        redis: redisReady ? "ready" : "down",
      },
    },
  });
});

app.use("/api/v1/auth", authRateLimiter, authRoutes);
app.use("/api/v1/stocks", stockRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/portfolio", portfolioRoutes);
app.use("/api/v1/account", accountRoutes);
app.use("/api/v1/market", marketRoutes);
app.use("/api/v1/orders",orderRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;