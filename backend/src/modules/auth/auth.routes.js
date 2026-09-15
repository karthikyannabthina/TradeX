const express = require("express");

const authController = require("./auth.controller");

const {
  registerSchema,
  loginSchema,
  refreshSchema,
  logoutSchema,
} = require("./auth.validator");

const validationMiddleware = require("../../middlewares/validation.middleware");
const authMiddleware = require("../../middlewares/auth.middleware");
const asyncHandler = require("../../utils/async-handler");

const router = express.Router();

router.post(
  "/register",
  validationMiddleware(registerSchema),
  asyncHandler(authController.register)
);

router.post(
  "/login",
  validationMiddleware(loginSchema),
  asyncHandler(authController.login)
);

router.post(
  "/refresh",
  validationMiddleware(refreshSchema),
  asyncHandler(authController.refresh)
);

router.post(
  "/logout",
  validationMiddleware(logoutSchema),
  asyncHandler(authController.logout)
);

router.get(
  "/me",
  authMiddleware,
  asyncHandler(async (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Authentication successful",
      data: {
        user: req.user,
      },
    });
  })
);

module.exports = router;