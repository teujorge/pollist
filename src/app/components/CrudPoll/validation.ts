import { z } from "zod";

const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

const zFile = z
  .instanceof(File)
  .optional()
  .refine((file) => file?.size ?? 0 <= MAX_FILE_SIZE, `Max file size is 5MB.`)
  .refine(
    (file) => (file ? ACCEPTED_IMAGE_TYPES.includes(file.type) : true),
    ".jpg, .jpeg, .png, .webp and .gif files are accepted.",
  );

export const createPollSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  option1: z.string().min(1, "Option is required"),
  file1: zFile,
  option2: z.string().min(1, "Option is required"),
  file2: zFile,
  options: z.array(
    z.object({
      value: z.string().min(1, "Option is required"),
      file: zFile,
    }),
  ),
});

export type CreatePollFields = z.infer<typeof createPollSchema>;
