const { z } = require("zod");

const createOrderSchema = z.object({
  symbol: z
    .string()
    .min(1)
    .max(20)
    .transform((value) =>
      value.toUpperCase()
    ),

  exchange: z.enum(["NSE", "BSE"]),

  side: z.enum(["BUY", "SELL"]),

  orderType: z.literal("MARKET"),

  quantity: z
    .number()
    .int()
    .positive(),
});

module.exports = {
  createOrderSchema,
};