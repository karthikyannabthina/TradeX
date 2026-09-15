const accountRepository = require("./account.repository");

const AppError = require("../../errors/AppError");

const getAccount = async (userId) => {
  const account =
    await accountRepository.findByUserId(userId);

  if (!account) {
    throw new AppError(
      "Trading account not found",
      404,
      "ACCOUNT_NOT_FOUND"
    );
  }

  return account;
};

const getAvailableBalance = async (userId) => {
  const account = await getAccount(userId);

  return account.balance - account.blockedAmount;
};

module.exports = {
  getAccount,
  getAvailableBalance,
};