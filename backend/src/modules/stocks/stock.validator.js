const { z } = require("zod");

const createStockSchema = z.object({
  symbol: z
    .string()
    .min(1)
    .max(20)
    .transform((value) => value.toUpperCase()),

  name: z
    .string()
    .min(2)
    .max(100),

  exchange: z.enum(["NSE", "BSE"]),

  sector: z
    .string()
    .max(100)
    .optional(),

  currentPrice: z
    .number()
    .positive(),

  previousClose: z
    .number()
    .positive(),

  dayOpen: z
    .number()
    .positive(),

  dayHigh: z
    .number()
    .positive(),

  dayLow: z
    .number()
    .positive(),

  volume: z
    .number()
    .nonnegative()
    .optional(),
});

module.exports = {
  createStockSchema,
};