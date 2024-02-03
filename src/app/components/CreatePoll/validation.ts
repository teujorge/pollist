import { z } from "zod";

export const createPollSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  options: z
    .array(
      z.object({
        value: z.string().min(1, "Option is required"),
      }),
    )
    .min(2, "At least two options are required"),
});

export type CreatePollFields = z.infer<typeof createPollSchema>;
