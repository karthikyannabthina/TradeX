  const mongoose = require("mongoose");

  const accountSchema = new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
        index: true,
      },

      balance: {
        type: Number,
        required: true,
        default: 100000,
        min: 0,
      },

      blockedAmount: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
      },
    },
    {
      timestamps: true,
    }
  );

  module.exports = mongoose.model("Account", accountSchema);