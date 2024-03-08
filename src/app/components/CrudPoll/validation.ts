import { z } from "zod";

// max file size 5mb
const maxFileSize = 5 * 1024 * 1024;
// file type jpeg, png, webp, gif
const allowedFileTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

const zFile = z
  .instanceof(FileList)
  .optional()
  .refine(
    (files) =>
      files === undefined ||
      files.length === 0 ||
      (files[0]?.size ?? 0) <= maxFileSize,
    {
      message: "File size must be less than 5MB",
    },
  )
  .refine(
    (files) =>
      files === undefined ||
      files.length === 0 ||
      allowedFileTypes.includes(files[0]?.type ?? ""),
    {
      message: "File type must be JPEG, PNG, WEBP, or GIF",
    },
  );

export const createPollSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  option1: z.string().min(1, "Option is required"),
  option1file: zFile,
  option2: z.string().min(1, "Option is required"),
  option2file: zFile,
  options: z.array(
    z.object({
      value: z.string().min(1, "Option is required"),
      file: zFile,
    }),
  ),
});

export type CreatePollFields = z.infer<typeof createPollSchema>;
