const { z } = require("zod");

const profileUpdateSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must contain at least 2 characters")
      .max(50, "Name cannot exceed 50 characters")
      .optional(),

    email: z
      .string()
      .trim()
      .email("Invalid email address")
      .transform((email) => email.toLowerCase())
      .optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one valid profile field is required",
  });

module.exports = {
  profileUpdateSchema,
};
