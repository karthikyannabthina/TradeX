const portfolioPerformanceRepository = require(
  "./portfolio-performance.repository"
);

const createSnapshot = async ({
  userId,
  portfolioValue,
  investedAmount,
  availableFunds,
  pnl,
  recordedAt,
  session = null,
}) => {
  return portfolioPerformanceRepository.createSnapshot({
    userId,
    portfolioValue,
    investedAmount,
    availableFunds,
    pnl,
    recordedAt,
    session,
  });
};

const getPerformanceHistory = async (
  userId,
  limit = 100
) => {
  return portfolioPerformanceRepository.findByUserId(
    userId,
    limit
  );
};

module.exports = {
  createSnapshot,
  getPerformanceHistory,
};