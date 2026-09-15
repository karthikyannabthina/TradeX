const mongoose = require("mongoose");
const env = require("./env");
const logger = require("./logger");

const isDatabaseReady = () => mongoose.connection.readyState === 1;

const connectDatabase = async () => {
  try {
    await mongoose.connect(env.mongoUri);

    logger.info("MongoDB connected");
  } catch (error) {
    logger.error("MongoDB connection failed", {
      error: error.message,
    });

    process.exit(1);
  }
};

const closeDatabase = async () => {
  if (!isDatabaseReady()) {
    return;
  }

  await mongoose.disconnect();
  logger.info("MongoDB disconnected");
};

module.exports = connectDatabase;
module.exports.connectDatabase = connectDatabase;
module.exports.isDatabaseReady = isDatabaseReady;
module.exports.closeDatabase = closeDatabase;