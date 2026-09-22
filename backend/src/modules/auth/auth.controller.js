const authService = require("./auth.service");

const register = async (req, res) => {
  const user = await authService.register(req.validated);

  return res.status(201).json({
    success: true,
    message: "Registration successful",
    data: {
      user,
    },
  });
};

const login = async (req, res) => {
  const result = await authService.login(req.validated);

  return res.status(200).json({
    success: true,
    message: "Login successful",
    data: result,
  });
};

const googleLogin = async (req, res) => {
  const result = await authService.googleLogin(req.validated);

  return res.status(200).json({
    success: true,
    message: "Google login successful",
    data: result,
  });
};

const refresh = async (req, res) => {
  const result = await authService.refresh(req.validated);

  return res.status(200).json({
    success: true,
    message: "Token refreshed successfully",
    data: result,
  });
};

const logout = async (req, res) => {
  await authService.logout(req.validated);

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

module.exports = {
  register,
  login,
  googleLogin,
  refresh,
  logout,
};