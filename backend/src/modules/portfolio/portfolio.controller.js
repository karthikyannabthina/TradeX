const portfolioService = require("./portfolio.service");

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

module.exports = {
  getPortfolio,
};
