const Account = require("./account.model");

const findByUserId = (userId, session = null) => {
  const query = Account.findOne({ userId });

  if (session) {
    query.session(session);
  }

  return query;
};

const createAccount = (userId, session = null) => {
  return Account.create(
    [
      {
        userId,
        balance: 100000,
        blockedAmount: 0,
      },
    ],
    session ? { session } : undefined
  ).then((accounts) => accounts[0]);
};

const createIfNotExists = async (userId) => {
  let account = await findByUserId(userId);

  if (!account) {
    account = await createAccount(userId);
  }

  return account;
};

/**
 * Deduct money atomically.
 *
 * This prevents two simultaneous orders
 * from spending the same balance.
 */
const debitBalance = async (
  userId,
  amount,
  session
) => {
  return Account.findOneAndUpdate(
    {
      userId,

      $expr: {
        $gte: [
          {
            $subtract: [
              "$balance",
              "$blockedAmount",
            ],
          },
          amount,
        ],
      },
    },
    {
      $inc: {
        balance: -amount,
      },
    },
    {
      new: true,
      session,
    }
  );
};

const creditBalance = async (
  userId,
  amount,
  session = null
) => {
  return Account.findOneAndUpdate(
    { userId },
    {
      $inc: {
        balance: amount,
      },
    },
    {
      new: true,
      session,
    }
  );
};

module.exports = {
  findByUserId,
  createAccount,
  createIfNotExists,
  debitBalance,
  creditBalance,
};