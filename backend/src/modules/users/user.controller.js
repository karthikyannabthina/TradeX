const userService = require("./user.service");

const getProfile = async (req, res) => {
  const userId = req.user.userId;
  const user = await userService.getProfile(userId);

  return res.status(200).json({
    success: true,
    message: "Profile retrieved successfully",
    data: {
      user,
    },
  });
};

const updateProfile = async (req, res) => {
  const userId = req.user.userId;
  const user = await userService.updateProfile(userId, req.validated);

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: {
      user,
    },
  });
};

module.exports = {
  getProfile,
  updateProfile,
};
