const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    exchange: {
      type: String,
      enum: ["NSE", "BSE"],
      required: true,
    },

    sector: {
      type: String,
      default: null,
    },

    currentPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    previousClose: {
      type: Number,
      required: true,
      min: 0,
    },

    dayOpen: {
      type: Number,
      required: true,
      min: 0,
    },

    dayHigh: {
      type: Number,
      required: true,
      min: 0,
    },

    dayLow: {
      type: Number,
      required: true,
      min: 0,
    },

    volume: {
      type: Number,
      default: 0,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Stock = mongoose.model("Stock", stockSchema);

module.exports = Stock;