import { z } from "zod";

export const createPollSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  option1: z.string().min(1, "Option is required"),
  option2: z.string().min(1, "Option is required"),
  options: z.array(
    z.object({
      value: z.string().min(1, "Option is required"),
    }),
  ),
  realtime: z.boolean(),
  duration: z
    .number()
    .min(1, "Duration must be at least 1 hour")
    .max(24, "Duration must be at most 24 hours")
    .optional(),
  allowAnon: z.boolean().optional(),
});

export type CreatePollFields = z.infer<typeof createPollSchema>;
