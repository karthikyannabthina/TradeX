const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    exchange: {
      type: String,
      enum: ["NSE", "BSE"],
      required: true,
    },

    side: {
      type: String,
      enum: ["BUY", "SELL"],
      required: true,
    },

    orderType: {
      type: String,
      enum: ["MARKET"],
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    requestedPrice: {
      type: Number,
      default: null,
    },

    executedPrice: {
      type: Number,
      default: null,
    },

    totalAmount: {
      type: Number,
      default: null,
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "EXECUTED",
        "CANCELLED",
        "REJECTED",
      ],
      default: "PENDING",
    },

    rejectionReason: {
      type: String,
      default: null,
    },

    executedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({
  userId: 1,
  createdAt: -1,
});

module.exports = mongoose.model(
  "Order",
  orderSchema
);