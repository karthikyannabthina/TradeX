const portfolioService = require("./portfolio.service");
const portfolioPerformanceService =
  require("./portfolio-performance.service");

const getPortfolio = async (req, res) => {
  const userId = req.user.userId;
  const portfolio = await portfolioService.getPortfolio(userId);

  return res.status(200).json({
    success: true,
    message: "Portfolio retrieved successfully",
    data: {
      portfolio,
    },
  });
};

const getPortfolioPerformance = async (req, res) => {
  const userId = req.user.userId;

  const performance =
    await portfolioPerformanceService.getPerformanceHistory(
      userId
    );

  return res.status(200).json({
    success: true,
    message: "Portfolio performance retrieved successfully",
    data: {
      performance,
    },
  });
};

module.exports = {
  getPortfolio,
  getPortfolioPerformance,
};
