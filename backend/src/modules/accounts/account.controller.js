const accountService = require("./account.service");

const getAccount = async (req, res) => {
  const userId = req.user.userId;
  const account = await accountService.getAccount(userId);

  return res.status(200).json({
    success: true,
    message: "Account retrieved successfully",
    data: {
      account,
    },
  });
};

module.exports = {
  getAccount,
};
