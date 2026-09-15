const express = require("express");

const marketController =
  require("./market.controller");

const asyncHandler =
  require("../../utils/async-handler");

const router = express.Router();


router.get(
  "/",
  asyncHandler(
    marketController.getMarketState
  )
);


router.get(
  "/:symbol/candles",
  asyncHandler(
    marketController.getHistoricalCandles
  )
);


module.exports = router;