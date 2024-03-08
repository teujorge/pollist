import { z } from "zod";

// max file size 5mb
const maxFileSize = 5 * 1024 * 1024;
// file type jpeg, png, webp, gif
const allowedFileTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

type _File = {
  size: number;
  type: string;
};

const zFile = z
  .any()
  .optional()
  .refine(
    (files) => {
      return (
        files === undefined ||
        (typeof files === "object" &&
          files !== null &&
          "length" in files &&
          Array.from(files as Iterable<unknown>).every(
            (file) =>
              typeof file === "object" &&
              file !== null &&
              "size" in file &&
              "type" in file,
          ))
      );
    },
    {
      message: "Input must be an array of file-like objects",
    },
  )
  .refine(
    (files) => {
      // File size check
      return (
        files === undefined ||
        (files as Array<_File>).length === 0 ||
        ((files as Array<_File>)[0]?.size ?? 0) <= maxFileSize
      );
    },
    {
      message: "File size must be less than 5MB",
    },
  )
  .refine(
    (files) => {
      // File type check
      return (
        files === undefined ||
        (files as Array<unknown>).length === 0 ||
        allowedFileTypes.includes((files as Array<_File>)[0]?.type ?? "")
      );
    },
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
