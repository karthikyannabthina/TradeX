const Portfolio = require("./portfolio.model");

const findByUserId = (
  userId,
  session = null
) => {
  const query = Portfolio.findOne({ userId });

  if (session) {
    query.session(session);
  }

  return query;
};

const createPortfolio = (
  userId,
  session = null
) => {
  return Portfolio.create(
    [
      {
        userId,
        holdings: [],
      },
    ],
    session ? { session } : undefined
  ).then((portfolios) => portfolios[0]);
};

const createIfNotExists = async (userId) => {
  let portfolio = await findByUserId(userId);

  if (!portfolio) {
    portfolio = await createPortfolio(userId);
  }

  return portfolio;
};

const updatePortfolio = (
  portfolioId,
  update,
  session = null
) => {
  return Portfolio.findByIdAndUpdate(
    portfolioId,
    update,
    {
      new: true,
      runValidators: true,
      session,
    }
  );
};

module.exports = {
  findByUserId,
  createPortfolio,
  createIfNotExists,
  updatePortfolio,
};