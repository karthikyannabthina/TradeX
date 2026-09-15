const express = require("express");

const orderController =
  require("./order.controller");

const orderValidator =
  require("./order.validator");

const validationMiddleware =
  require("../../middlewares/validation.middleware");

const asyncHandler =
  require("../../utils/async-handler");

const authMiddleware =
  require("../../middlewares/auth.middleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  validationMiddleware(
    orderValidator.createOrderSchema
  ),
  asyncHandler(orderController.createOrder)
);

router.get(
  "/",
  authMiddleware,
  asyncHandler(orderController.getMyOrders)
);

module.exports = router;