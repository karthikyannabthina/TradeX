const argon2 = require("argon2");

const hashPassword = async (password) => {
  return argon2.hash(password);
};

const comparePassword = async (password, passwordHash) => {
  return argon2.verify(passwordHash, password);
};

module.exports = {
  hashPassword,
  comparePassword,
};