const express = require("express");

const userController = require("./user.controller");
const { profileUpdateSchema } = require("./user.validator");
const validationMiddleware = require("../../middlewares/validation.middleware");
const authMiddleware = require("../../middlewares/auth.middleware");
const asyncHandler = require("../../utils/async-handler");

const router = express.Router();

router.get(
  "/me",
  authMiddleware,
  asyncHandler(userController.getProfile)
);

router.patch(
  "/me",
  authMiddleware,
  validationMiddleware(profileUpdateSchema),
  asyncHandler(userController.updateProfile)
);

module.exports = router;
