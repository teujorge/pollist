import { z } from "zod";

export const createPollSchema = z.object({
    title:z.string().min(1,"Title is required"),
    description:z.string().optional(),
    option1:z.string().min(1,"Option is required"),
    option2:z.string().min(1,"Option is required"),
})

export type CreatePollFields = z.infer<typeof createPollSchema>