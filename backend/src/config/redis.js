const { createClient } = require("redis");
const logger = require("./logger");

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => {
  logger.error("Redis error", {
    error: err.message,
  });
});

redisClient.on("connect", () => {
  logger.info("Connecting to Redis");
});

redisClient.on("ready", () => {
  logger.info("Redis ready");
});

redisClient.on("reconnecting", () => {
  logger.warn("Redis reconnecting");
});

const isRedisReady = () => Boolean(redisClient.isOpen && redisClient.isReady);

const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

const closeRedis = async () => {
  if (redisClient.isOpen) {
    await redisClient.quit();
    logger.info("Redis disconnected");
  }
};

module.exports = {
  redisClient,
  connectRedis,
  isRedisReady,
  closeRedis,
};