const express = require("express");

const accountController = require("./account.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const asyncHandler = require("../../utils/async-handler");

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  asyncHandler(accountController.getAccount)
);

module.exports = router;
