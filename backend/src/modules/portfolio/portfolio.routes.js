const express = require("express");

const portfolioController = require("./portfolio.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const asyncHandler = require("../../utils/async-handler");

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  asyncHandler(portfolioController.getPortfolio)
);

module.exports = router;
