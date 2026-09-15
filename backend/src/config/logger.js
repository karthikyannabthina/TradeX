const normalizeMeta = (meta = {}) => {
  if (!meta || typeof meta !== "object") {
    return {};
  }

  const normalized = { ...meta };

  delete normalized.password;
  delete normalized.passwordHash;
  delete normalized.accessToken;
  delete normalized.refreshToken;
  delete normalized.authorization;
  delete normalized.headers;
  delete normalized.body;

  return normalized;
};

const log = (level, message, meta = {}) => {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...normalizeMeta(meta),
  };

  const serialized = JSON.stringify(entry);

  if (level === "error") {
    console.error(serialized);
    return;
  }

  console.log(serialized);
};

const info = (message, meta) => log("info", message, meta);
const warn = (message, meta) => log("warn", message, meta);
const error = (message, meta) => log("error", message, meta);

module.exports = {
  info,
  warn,
  error,
};
