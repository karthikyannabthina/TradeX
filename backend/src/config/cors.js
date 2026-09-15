const env = require("./env");

const defaultOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:8080",
];

const allowedOrigins = (
  env.corsAllowedOrigins.length > 0
    ? env.corsAllowedOrigins
    : defaultOrigins
);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    if (env.nodeEnv !== "production") {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

module.exports = corsOptions;
