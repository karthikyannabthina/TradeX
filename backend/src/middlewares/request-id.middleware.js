const { randomUUID } = require("crypto");

const requestIdMiddleware = (req, res, next) => {
  const incomingRequestId = req.get("X-Request-Id");
  const requestId = incomingRequestId && incomingRequestId.trim()
    ? incomingRequestId.trim()
    : randomUUID();

  req.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);

  next();
};

module.exports = requestIdMiddleware;
