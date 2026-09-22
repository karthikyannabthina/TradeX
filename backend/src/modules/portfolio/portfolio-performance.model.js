const mongoose = require("mongoose");

const portfolioPerformanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    portfolioValue: {
      type: Number,
      required: true,
      min: 0,
    },

    investedAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    availableFunds: {
      type: Number,
      required: true,
      min: 0,
    },

    pnl: {
      type: Number,
      required: true,
    },

    recordedAt: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

portfolioPerformanceSchema.index({
  userId: 1,
  recordedAt: -1,
});

module.exports = mongoose.model(
  "PortfolioPerformance",
  portfolioPerformanceSchema
);