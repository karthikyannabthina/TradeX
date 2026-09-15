const express = require("express");

const stockController = require("./stock.controller");
const { createStockSchema } = require("./stock.validator");

const validationMiddleware = require("../../middlewares/validation.middleware");
const authMiddleware = require("../../middlewares/auth.middleware");
const { requireRole } = require("../../middlewares/authorization.middleware");
const asyncHandler = require("../../utils/async-handler");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  requireRole("ADMIN"),
  validationMiddleware(createStockSchema),
  asyncHandler(stockController.createStock)
);

router.get(
  "/",
  asyncHandler(stockController.getAllStocks)
);

router.get(
  "/search",
  asyncHandler(stockController.searchStocks)
);

router.get(
  "/:symbol",
  asyncHandler(stockController.getStockBySymbol)
);

module.exports = router;