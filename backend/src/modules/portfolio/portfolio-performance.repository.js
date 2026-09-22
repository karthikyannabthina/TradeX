const PortfolioPerformance = require(
  "./portfolio-performance.model"
);

const createSnapshot = ({
  userId,
  portfolioValue,
  investedAmount,
  availableFunds,
  pnl,
  recordedAt = new Date(),
  session = null,
}) => {
  return PortfolioPerformance.create(
    [
      {
        userId,
        portfolioValue,
        investedAmount,
        availableFunds,
        pnl,
        recordedAt,
      },
    ],
    session ? { session } : undefined
  ).then((snapshots) => snapshots[0]);
};

const findByUserId = (userId, limit = 100) => {
  return PortfolioPerformance.find({ userId })
    .sort({ recordedAt: 1 })
    .limit(limit);
};

module.exports = {
  createSnapshot,
  findByUserId,
};