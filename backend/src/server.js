const dns = require("dns");

dns.setServers(["172.100.0.1"]);

const http = require("http");

const app = require("./app");
const env = require("./config/env");
const logger = require("./config/logger");
const connectDatabase = require("./config/database");
const { closeDatabase } = require("./config/database");

const {
  connectRedis,
  closeRedis,
} = require("./config/redis");

const {
  initializeMarket,
  startMarketSimulator,
} = require("./modules/market/market.simulator");

const {
  initializeSocket,
} = require("./socket/socket.server");

let httpServer;
let isShuttingDown = false;

const shutdown = async (signal) => {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  logger.warn("Shutdown signal received", { signal });

  try {
    if (httpServer && httpServer.listening) {
      await new Promise((resolve, reject) => {
        httpServer.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });
    }
  } catch (error) {
    logger.error("Error closing HTTP server", {
      error: error.message,
    });
  }

  await Promise.allSettled([closeDatabase(), closeRedis()]);
  logger.info("Shutdown complete");

  process.exit(0);
};

const startServer = async () => {
  try {
    await connectDatabase();
    await connectRedis();
    await initializeMarket();

    httpServer = http.createServer(app);
    initializeSocket(httpServer);
    startMarketSimulator();

    httpServer.listen(env.port, () => {
      logger.info("TradeX server running", {
        port: env.port,
      });
    });
  } catch (error) {
    logger.error("Failed to start server", {
      error: error.message,
    });

    process.exit(1);
  }
};

process.on("SIGINT", () => {
  shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  shutdown("SIGTERM");
});

startServer();